
import math

class Crop:
    def __init__(self, name, growth_rate_per_day, nutrient_uptake_per_unit_growth, water_consumption_per_day, yield_per_unit_growth, max_growth_stage, current_growth_stage=0, health=1.0):
        self.name = name
        self.growth_rate_per_day = growth_rate_per_day  # How much it grows per day under ideal conditions
        self.nutrient_uptake_per_unit_growth = nutrient_uptake_per_unit_growth  # Nitrates needed per unit of growth
        self.water_consumption_per_day = water_consumption_per_day # Water consumed per day
        self.yield_per_unit_growth = yield_per_unit_growth # How much yield it produces per unit of growth
        self.max_growth_stage = max_growth_stage # Max growth stage before harvest
        self.current_growth_stage = current_growth_stage
        self.health = health # 0.0 to 1.0, affects growth
        self.is_harvested = False

    def simulate_growth(self, available_nitrates, available_water):
        if self.is_harvested or self.current_growth_stage >= self.max_growth_stage:
            return 0, 0 # No growth, no consumption if harvested or mature

        # Calculate potential growth based on ideal conditions
        potential_growth = self.growth_rate_per_day

        # Adjust growth based on nutrient and water availability
        nutrient_factor = min(1.0, available_nitrates / (self.nutrient_uptake_per_unit_growth * potential_growth)) if (self.nutrient_uptake_per_unit_growth * potential_growth) > 0 else 1.0
        water_factor = min(1.0, available_water / self.water_consumption_per_day) if self.water_consumption_per_day > 0 else 1.0

        actual_growth = potential_growth * nutrient_factor * water_factor

        # Update health based on resource availability
        if nutrient_factor < 1.0 or water_factor < 1.0:
            self.health = max(0.0, self.health - 0.05) # Decrease health if resources are low
        else:
            self.health = min(1.0, self.health + 0.01) # Slowly recover health

        # Apply health factor to growth
        actual_growth *= self.health

        # Ensure growth doesn't exceed max_growth_stage
        growth_to_apply = min(actual_growth, self.max_growth_stage - self.current_growth_stage)
        self.current_growth_stage += growth_to_apply

        # Calculate actual nutrient and water consumption based on actual growth
        nutrients_consumed = growth_to_apply * self.nutrient_uptake_per_unit_growth
        water_consumed = growth_to_apply * self.water_consumption_per_day # Simplified: water consumption scales with growth

        return nutrients_consumed, water_consumed

    def calculate_yield(self):
        # Yield is proportional to the current growth stage achieved
        return self.current_growth_stage * self.yield_per_unit_growth

    def harvest(self):
        self.is_harvested = True
        yield_amount = self.calculate_yield()
        self.current_growth_stage = 0
        self.health = 1.0
        return yield_amount

class Fish:
    def __init__(self, name, growth_rate_per_day, waste_production_per_day, oxygen_consumption_per_day, max_size, current_size=0, health=1.0):
        self.name = name
        self.growth_rate_per_day = growth_rate_per_day # How much it grows per day
        self.waste_production_per_day = waste_production_per_day # Ammonia produced per day per unit of size
        self.oxygen_consumption_per_day = oxygen_consumption_per_day # Oxygen consumed per day per unit of size
        self.max_size = max_size # Max size before harvest
        self.current_size = current_size
        self.health = health # 0.0 to 1.0, affects growth and waste production
        self.is_harvested = False

    def simulate_growth_and_waste(self, water_quality_factor=1.0):
        if self.is_harvested or self.current_size >= self.max_size:
            return 0, 0 # No growth, no waste if harvested or mature

        # Potential growth based on ideal conditions
        potential_growth = self.growth_rate_per_day

        # Adjust growth based on water quality and health
        actual_growth = potential_growth * water_quality_factor * self.health

        # Ensure growth doesn't exceed max_size
        growth_to_apply = min(actual_growth, self.max_size - self.current_size)
        self.current_size += growth_to_apply

        # Waste production scales with current size and health
        ammonia_produced = self.waste_production_per_day * self.current_size * self.health
        oxygen_consumed = self.oxygen_consumption_per_day * self.current_size

        return ammonia_produced, oxygen_consumed

    def harvest(self):
        self.is_harvested = True
        harvest_size = self.current_size
        self.current_size = 0
        self.health = 1.0
        return harvest_size

class Biosphere:
    def __init__(self, water_volume, initial_ammonia=0, initial_nitrite=0, initial_nitrate=0, initial_ph=7.0, nitrification_rate=0.1, denitrification_rate=0.05, water_evaporation_rate=0.01, daily_water_top_up=0):
        self.water_volume = water_volume
        self.ammonia = initial_ammonia
        self.nitrite = initial_nitrite
        self.nitrate = initial_nitrate
        self.ph = initial_ph # Simplified, not actively simulated yet
        self.nitrification_rate = nitrification_rate # Rate of ammonia to nitrite, and nitrite to nitrate conversion
        self.denitrification_rate = denitrification_rate # Rate of nitrate loss (e.g., through anaerobic bacteria or plant uptake not fully accounted for)
        self.water_evaporation_rate = water_evaporation_rate # Percentage of water lost daily
        self.daily_water_top_up = daily_water_top_up # Amount of water added daily

        self.crops = [] # List of Crop instances
        self.fishes = [] # List of Fish instances
        self.current_day = 0
        self.total_crop_yield = {}
        self.total_fish_yield = {}

    def add_crop(self, crop_instance):
        self.crops.append(crop_instance)

    def add_fish(self, fish_instance):
        self.fishes.append(fish_instance)

    def simulate_day(self):
        self.current_day += 1

        # 1. Fish produce waste and consume oxygen
        total_ammonia_from_fish = 0
        total_oxygen_consumed_by_fish = 0
        for fish in self.fishes:
            # Water quality factor for fish health (simplified: based on ammonia/nitrite levels)
            water_quality_factor = 1.0
            if self.ammonia > 0.5 or self.nitrite > 0.2: # Thresholds for unhealthy levels
                water_quality_factor = 0.8
                fish.health = max(0.0, fish.health - 0.02) # Decrease fish health
            else:
                fish.health = min(1.0, fish.health + 0.01) # Slowly recover fish health

            ammonia_produced, oxygen_consumed = fish.simulate_growth_and_waste(water_quality_factor)
            total_ammonia_from_fish += ammonia_produced
            total_oxygen_consumed_by_fish += oxygen_consumed # Not used in current simulation, but good to track

        self.ammonia += total_ammonia_from_fish

        # 2. Nitrification (Bacterial Conversion)
        # Ammonia to Nitrite
        ammonia_converted_to_nitrite = min(self.ammonia, self.ammonia * self.nitrification_rate)
        self.ammonia -= ammonia_converted_to_nitrite
        self.nitrite += ammonia_converted_to_nitrite

        # Nitrite to Nitrate
        nitrite_converted_to_nitrate = min(self.nitrite, self.nitrite * self.nitrification_rate)
        self.nitrite -= nitrite_converted_to_nitrate
        self.nitrate += nitrite_converted_to_nitrate

        # 3. Plants consume nutrients and water
        total_nutrients_consumed_by_crops = 0
        total_water_consumed_by_crops = 0
        for crop in self.crops:
            nutrients_consumed, water_consumed = crop.simulate_growth(self.nitrate, self.water_volume)
            total_nutrients_consumed_by_crops += nutrients_consumed
            total_water_consumed_by_crops += water_consumed

        self.nitrate = max(0, self.nitrate - total_nutrients_consumed_by_crops)
        self.water_volume = max(0, self.water_volume - total_water_consumed_by_crops)

        # 4. Water evaporation and top-up
        self.water_volume *= (1 - self.water_evaporation_rate)
        self.water_volume += self.daily_water_top_up

        # 5. Denitrification (simplified nitrate loss)
        self.nitrate = max(0, self.nitrate - (self.nitrate * self.denitrification_rate))

        # Ensure no negative values for water parameters
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
            "ph": self.ph, # pH is simplified
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
                "is_harvested": crop.is_harvested
            })
        for fish in self.fishes:
            status["fishes"].append({
                "name": fish.name,
                "current_size": round(fish.current_size, 2),
                "max_size": fish.max_size,
                "health": round(fish.health, 2),
                "is_harvested": fish.is_harvested
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
        self.water_volume = 1000 # Default initial water volume
        self.ammonia = 0
        self.nitrite = 0
        self.nitrate = 0
        self.ph = 7.0
        self.crops = []
        self.fishes = []
        self.current_day = 0
        self.total_crop_yield = {}
        self.total_fish_yield = {}


# Initial data for crops and fishes
CROP_TYPES = {
    "Avocado": {
        "growth_rate_per_day": 0.01, # Slow growth
        "nutrient_uptake_per_unit_growth": 0.5, # High nutrient demand
        "water_consumption_per_day": 0.2, # High water consumption
        "yield_per_unit_growth": 10.0,
        "max_growth_stage": 10.0
    },
    "Mango": {
        "growth_rate_per_day": 0.012, # Slow growth
        "nutrient_uptake_per_unit_growth": 0.45, # High nutrient demand
        "water_consumption_per_day": 0.18, # High water consumption
        "yield_per_unit_growth": 12.0,
        "max_growth_stage": 10.0
    },
    "Tomato": {
        "growth_rate_per_day": 0.05, # Faster growth
        "nutrient_uptake_per_unit_growth": 0.2, # Moderate nutrient demand
        "water_consumption_per_day": 0.1, # Moderate water consumption
        "yield_per_unit_growth": 5.0,
        "max_growth_stage": 5.0
    },
    "Lettuce": {
        "growth_rate_per_day": 0.1, # Fast growth
        "nutrient_uptake_per_unit_growth": 0.1, # Low nutrient demand
        "water_consumption_per_day": 0.05, # Low water consumption
        "yield_per_unit_growth": 2.0,
        "max_growth_stage": 2.0
    }
}

FISH_TYPES = {
    "Tilapia": {
        "growth_rate_per_day": 0.02, # Fast growth
        "waste_production_per_day": 0.05, # Moderate waste
        "oxygen_consumption_per_day": 0.01, # Moderate oxygen
        "max_size": 5.0
    },
    "Crab": {
        "growth_rate_per_day": 0.005, # Slow growth
        "waste_production_per_day": 0.01, # Low waste
        "oxygen_consumption_per_day": 0.005, # Low oxygen
        "max_size": 2.0
    },
    "Salmon": {
        "growth_rate_per_day": 0.015, # Moderate growth
        "waste_production_per_day": 0.03, # Moderate waste
        "oxygen_consumption_per_day": 0.015, # Moderate oxygen
        "max_size": 7.0
    },
    "Catfish": {
        "growth_rate_per_day": 0.025, # Fast growth
        "waste_production_per_day": 0.06, # High waste
        "oxygen_consumption_per_day": 0.012, # Moderate oxygen
        "max_size": 6.0
    }
}


