import math
import json

class Crop:
    def __init__(self, name, growth_rate_per_day, nutrient_uptake_per_unit_growth, water_consumption_per_day, yield_per_unit_growth, max_growth_stage, current_growth_stage=0, health=1.0):
        self.name = name
        self.growth_rate_per_day = growth_rate_per_day
        self.nutrient_uptake_per_unit_growth = nutrient_uptake_per_unit_growth
        self.water_consumption_per_day = water_consumption_per_day
        self.yield_per_unit_growth = yield_per_unit_growth
        self.max_growth_stage = max_growth_stage
        self.current_growth_stage = current_growth_stage
        self.health = health
        self.is_harvested = False

    def simulate_growth(self, available_nitrates, available_water):
        if self.is_harvested or self.current_growth_stage >= self.max_growth_stage:
            return 0, 0

        potential_growth = self.growth_rate_per_day

        nutrient_factor = min(1.0, available_nitrates / (self.nutrient_uptake_per_unit_growth * potential_growth)) if (self.nutrient_uptake_per_unit_growth * potential_growth) > 0 else 1.0
        water_factor = min(1.0, available_water / self.water_consumption_per_day) if self.water_consumption_per_day > 0 else 1.0

        actual_growth = potential_growth * nutrient_factor * water_factor

        if nutrient_factor < 1.0 or water_factor < 1.0:
            self.health = max(0.0, self.health - 0.05)
        else:
            self.health = min(1.0, self.health + 0.01)

        actual_growth *= self.health

        growth_to_apply = min(actual_growth, self.max_growth_stage - self.current_growth_stage)
        self.current_growth_stage += growth_to_apply

        nutrients_consumed = growth_to_apply * self.nutrient_uptake_per_unit_growth
        water_consumed = growth_to_apply * self.water_consumption_per_day

        return nutrients_consumed, water_consumed

    def calculate_yield(self):
        return self.current_growth_stage * self.yield_per_unit_growth

    def harvest(self):
        self.is_harvested = True
        yield_amount = self.calculate_yield()
        self.current_growth_stage = 0
        self.health = 1.0
        return yield_amount

    def to_dict(self):
        return {
            "name": self.name,
            "growth_rate_per_day": self.growth_rate_per_day,
            "nutrient_uptake_per_unit_growth": self.nutrient_uptake_per_unit_growth,
            "water_consumption_per_day": self.water_consumption_per_day,
            "yield_per_unit_growth": self.yield_per_unit_growth,
            "max_growth_stage": self.max_growth_stage,
            "current_growth_stage": self.current_growth_stage,
            "health": self.health,
            "is_harvested": self.is_harvested
        }

    @classmethod
    def from_dict(cls, data):
        crop = cls(
            data["name"],
            data["growth_rate_per_day"],
            data["nutrient_uptake_per_unit_growth"],
            data["water_consumption_per_day"],
            data["yield_per_unit_growth"],
            data["max_growth_stage"],
            data.get("current_growth_stage", 0),
            data.get("health", 1.0)
        )
        crop.is_harvested = data.get("is_harvested", False)
        return crop

class Fish:
    def __init__(self, name, growth_rate_per_day, waste_production_per_day, oxygen_consumption_per_day, max_size, current_size=0, health=1.0):
        self.name = name
        self.growth_rate_per_day = growth_rate_per_day
        self.waste_production_per_day = waste_production_per_day
        self.oxygen_consumption_per_day = oxygen_consumption_per_day
        self.max_size = max_size
        self.current_size = current_size
        self.health = health
        self.is_harvested = False

    def simulate_growth_and_waste(self, water_quality_factor=1.0):
        if self.is_harvested or self.current_size >= self.max_size:
            return 0, 0

        potential_growth = self.growth_rate_per_day
        actual_growth = potential_growth * water_quality_factor * self.health

        growth_to_apply = min(actual_growth, self.max_size - self.current_size)
        self.current_size += growth_to_apply

        ammonia_produced = self.waste_production_per_day * self.current_size * self.health
        oxygen_consumed = self.oxygen_consumption_per_day * self.current_size

        return ammonia_produced, oxygen_consumed

    def harvest(self):
        self.is_harvested = True
        harvest_size = self.current_size
        self.current_size = 0
        self.health = 1.0
        return harvest_size

    def to_dict(self):
        return {
            "name": self.name,
            "growth_rate_per_day": self.growth_rate_per_day,
            "waste_production_per_day": self.waste_production_per_day,
            "oxygen_consumption_per_day": self.oxygen_consumption_per_day,
            "max_size": self.max_size,
            "current_size": self.current_size,
            "health": self.health,
            "is_harvested": self.is_harvested
        }

    @classmethod
    def from_dict(cls, data):
        fish = cls(
            data["name"],
            data["growth_rate_per_day"],
            data["waste_production_per_day"],
            data["oxygen_consumption_per_day"],
            data["max_size"],
            data.get("current_size", 0),
            data.get("health", 1.0)
        )
        fish.is_harvested = data.get("is_harvested", False)
        return fish

class Biosphere:
    def __init__(self, water_volume, initial_ammonia=0, initial_nitrite=0, initial_nitrate=0, initial_ph=7.0, nitrification_rate=0.1, denitrification_rate=0.05, water_evaporation_rate=0.01, daily_water_top_up=0):
        self.water_volume = water_volume
        self.ammonia = initial_ammonia
        self.nitrite = initial_nitrite
        self.nitrate = initial_nitrate
        self.ph = initial_ph
        self.nitrification_rate = nitrification_rate
        self.denitrification_rate = denitrification_rate
        self.water_evaporation_rate = water_evaporation_rate
        self.daily_water_top_up = daily_water_top_up

        self.crops = []
        self.fishes = []
        self.current_day = 0
        self.total_crop_yield = {}
        self.total_fish_yield = {}

    def add_crop(self, crop_instance):
        self.crops.append(crop_instance)

    def add_fish(self, fish_instance):
        self.fishes.append(fish_instance)

    def simulate_day(self):
        self.current_day += 1

        # Fish produce waste and consume oxygen
        total_ammonia_from_fish = 0
        total_oxygen_consumed_by_fish = 0
        for fish in self.fishes:
            water_quality_factor = 1.0
            if self.ammonia > 0.5 or self.nitrite > 0.2:
                water_quality_factor = 0.8
                fish.health = max(0.0, fish.health - 0.02)
            else:
                fish.health = min(1.0, fish.health + 0.01)

            ammonia_produced, oxygen_consumed = fish.simulate_growth_and_waste(water_quality_factor)
            total_ammonia_from_fish += ammonia_produced
            total_oxygen_consumed_by_fish += oxygen_consumed

        self.ammonia += total_ammonia_from_fish

        # Nitrification
        ammonia_converted_to_nitrite = min(self.ammonia, self.ammonia * self.nitrification_rate)
        self.ammonia -= ammonia_converted_to_nitrite
        self.nitrite += ammonia_converted_to_nitrite

        nitrite_converted_to_nitrate = min(self.nitrite, self.nitrite * self.nitrification_rate)
        self.nitrite -= nitrite_converted_to_nitrate
        self.nitrate += nitrite_converted_to_nitrate

        # Plants consume nutrients and water
        total_nutrients_consumed_by_crops = 0
        total_water_consumed_by_crops = 0
        for crop in self.crops:
            nutrients_consumed, water_consumed = crop.simulate_growth(self.nitrate, self.water_volume)
            total_nutrients_consumed_by_crops += nutrients_consumed
            total_water_consumed_by_crops += water_consumed

        self.nitrate = max(0, self.nitrate - total_nutrients_consumed_by_crops)
        self.water_volume = max(0, self.water_volume - total_water_consumed_by_crops)

        # Water evaporation and top-up
        self.water_volume *= (1 - self.water_evaporation_rate)
        self.water_volume += self.daily_water_top_up

        # Denitrification
        self.nitrate = max(0, self.nitrate - (self.nitrate * self.denitrification_rate))

        # Ensure no negative values
        self.ammonia = max(0, self.ammonia)
        self.nitrite = max(0, self.nitrite)
        self.nitrate = max(0, self.nitrate)
        self.water_volume = max(0, self.water_volume)

    def get_status(self):
        status = {
            "current_day": self.current_day,
            "water_volume": round(self.water_volume, 2),
            "ammonia": round(self.ammonia, 2),
            "nitrite": round(self.nitrite, 2),
            "nitrate": round(self.nitrate, 2),
            "ph": self.ph,
            "crops": [],
            "fishes": [],
            "total_crop_yield": self.total_crop_yield,
            "total_fish_yield": self.total_fish_yield
        }
        for crop in self.crops:
            status["crops"].append({
                "name": crop.name,
                "current_growth_stage": round(crop.current_growth_stage, 2),
                "max_growth_stage": crop.max_growth_stage,
                "health": round(crop.health, 2),
                "is_harvested": crop.is_harvested,
                "progress_percentage": round((crop.current_growth_stage / crop.max_growth_stage) * 100, 1) if crop.max_growth_stage > 0 else 0
            })
        for fish in self.fishes:
            status["fishes"].append({
                "name": fish.name,
                "current_size": round(fish.current_size, 2),
                "max_size": fish.max_size,
                "health": round(fish.health, 2),
                "is_harvested": fish.is_harvested,
                "progress_percentage": round((fish.current_size / fish.max_size) * 100, 1) if fish.max_size > 0 else 0
            })
        return status

    def harvest_crop(self, crop_name):
        for crop in self.crops:
            if crop.name == crop_name and not crop.is_harvested and crop.current_growth_stage >= crop.max_growth_stage:
                yield_amount = crop.harvest()
                self.total_crop_yield[crop_name] = self.total_crop_yield.get(crop_name, 0) + yield_amount
                return f"Harvested {round(yield_amount, 2)} units of {crop_name}."
        return f"Could not harvest {crop_name}. It might not be ready or already harvested."

    def harvest_fish(self, fish_name):
        for fish in self.fishes:
            if fish.name == fish_name and not fish.is_harvested and fish.current_size >= fish.max_size:
                harvest_size = fish.harvest()
                self.total_fish_yield[fish_name] = self.total_fish_yield.get(fish_name, 0) + harvest_size
                return f"Harvested {round(harvest_size, 2)} units of {fish_name}."
        return f"Could not harvest {fish_name}. It might not be ready or already harvested."

    def reset_simulation(self):
        self.ammonia = 0
        self.nitrite = 0
        self.nitrate = 0
        self.ph = 7.0
        self.crops = []
        self.fishes = []
        self.current_day = 0
        self.total_crop_yield = {}
        self.total_fish_yield = {}

    def to_dict(self):
        return {
            "water_volume": self.water_volume,
            "ammonia": self.ammonia,
            "nitrite": self.nitrite,
            "nitrate": self.nitrate,
            "ph": self.ph,
            "nitrification_rate": self.nitrification_rate,
            "denitrification_rate": self.denitrification_rate,
            "water_evaporation_rate": self.water_evaporation_rate,
            "daily_water_top_up": self.daily_water_top_up,
            "current_day": self.current_day,
            "total_crop_yield": self.total_crop_yield,
            "total_fish_yield": self.total_fish_yield,
            "crops": [crop.to_dict() for crop in self.crops],
            "fishes": [fish.to_dict() for fish in self.fishes]
        }

    @classmethod
    def from_dict(cls, data):
        biosphere = cls(
            data["water_volume"],
            data.get("ammonia", 0),
            data.get("nitrite", 0),
            data.get("nitrate", 0),
            data.get("ph", 7.0),
            data.get("nitrification_rate", 0.1),
            data.get("denitrification_rate", 0.05),
            data.get("water_evaporation_rate", 0.01),
            data.get("daily_water_top_up", 0)
        )
        biosphere.current_day = data.get("current_day", 0)
        biosphere.total_crop_yield = data.get("total_crop_yield", {})
        biosphere.total_fish_yield = data.get("total_fish_yield", {})
        
        for crop_data in data.get("crops", []):
            biosphere.add_crop(Crop.from_dict(crop_data))
        
        for fish_data in data.get("fishes", []):
            biosphere.add_fish(Fish.from_dict(fish_data))
        
        return biosphere

