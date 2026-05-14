import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import json
from biosphere_simulation_dynamic import Biosphere, Crop, Fish

# Page configuration
st.set_page_config(
    page_title="Artificial Biosphere Simulator",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'biosphere' not in st.session_state:
    st.session_state.biosphere = None
if 'simulation_running' not in st.session_state:
    st.session_state.simulation_running = False
if 'crop_templates' not in st.session_state:
    st.session_state.crop_templates = {}
if 'fish_templates' not in st.session_state:
    st.session_state.fish_templates = {}

def main():
    st.title("🌱 Artificial Biosphere Simulator")
    st.markdown("Create and manage your own closed-loop aquaponic ecosystem with custom crops and fish varieties.")
    
    # Sidebar for navigation
    with st.sidebar:
        st.header("Navigation")
        page = st.selectbox("Choose a section:", [
            "🏠 Home",
            "🌾 Crop Templates", 
            "🐟 Fish Templates",
            "🔧 Biosphere Setup",
            "📊 Simulation Dashboard",
            "💾 Save/Load System"
        ])
    
    if page == "🏠 Home":
        show_home_page()
    elif page == "🌾 Crop Templates":
        show_crop_templates()
    elif page == "🐟 Fish Templates":
        show_fish_templates()
    elif page == "🔧 Biosphere Setup":
        show_biosphere_setup()
    elif page == "📊 Simulation Dashboard":
        show_simulation_dashboard()
    elif page == "💾 Save/Load System":
        show_save_load_system()

def show_home_page():
    st.header("Welcome to the Artificial Biosphere Simulator")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🌿 What is an Artificial Biosphere?")
        st.write("""
        An artificial biosphere is a closed-loop ecosystem that combines aquaculture (fish farming) 
        with hydroponics (soilless plant cultivation). In this system:
        
        - **Fish** produce waste (ammonia) that feeds beneficial bacteria
        - **Bacteria** convert ammonia into nitrates that plants can use
        - **Plants** absorb nitrates, cleaning the water for fish
        - **Water** circulates between fish tanks and plant beds
        
        This creates a sustainable, resource-efficient farming system that maximizes yield 
        while minimizing water usage and eliminating the need for chemical fertilizers.
        """)
    
    with col2:
        st.subheader("🚀 Getting Started")
        st.write("""
        1. **Create Crop Templates**: Define your crop varieties with custom parameters
        2. **Create Fish Templates**: Define your fish varieties with custom parameters  
        3. **Setup Biosphere**: Configure your system size and environmental parameters
        4. **Add Organisms**: Add crops and fish to your biosphere
        5. **Run Simulation**: Watch your ecosystem grow and evolve over time
        6. **Harvest & Optimize**: Harvest mature organisms and optimize your system
        """)
        
        if st.button("🎯 Quick Start Guide", type="primary"):
            st.info("""
            **Quick Start:**
            1. Go to 'Crop Templates' and create at least one crop type
            2. Go to 'Fish Templates' and create at least one fish type
            3. Go to 'Biosphere Setup' to initialize your system
            4. Use 'Simulation Dashboard' to run and monitor your biosphere
            """)

def show_crop_templates():
    st.header("🌾 Crop Templates")
    st.write("Create and manage crop varieties with custom parameters.")
    
    # Create new crop template
    with st.expander("➕ Create New Crop Template", expanded=True):
        col1, col2 = st.columns(2)
        
        with col1:
            crop_name = st.text_input("Crop Name", placeholder="e.g., Tomato, Lettuce, Avocado")
            growth_rate = st.number_input("Growth Rate (per day)", min_value=0.001, max_value=1.0, value=0.05, step=0.001, 
                                        help="How much the crop grows each day under ideal conditions")
            nutrient_uptake = st.number_input("Nutrient Uptake (per unit growth)", min_value=0.01, max_value=2.0, value=0.2, step=0.01,
                                            help="Amount of nitrates consumed per unit of growth")
            water_consumption = st.number_input("Water Consumption (per day)", min_value=0.01, max_value=1.0, value=0.1, step=0.01,
                                              help="Amount of water consumed daily")
        
        with col2:
            yield_per_growth = st.number_input("Yield per Unit Growth", min_value=0.1, max_value=50.0, value=5.0, step=0.1,
                                             help="Harvestable yield produced per unit of growth")
            max_growth_stage = st.number_input("Maximum Growth Stage", min_value=1.0, max_value=20.0, value=5.0, step=0.1,
                                             help="Growth stage at which the crop is ready for harvest")
            
            st.markdown("**Crop Description:**")
            crop_description = st.text_area("Description (optional)", placeholder="Describe this crop variety...")
        
        if st.button("💾 Save Crop Template"):
            if crop_name:
                st.session_state.crop_templates[crop_name] = {
                    "growth_rate_per_day": growth_rate,
                    "nutrient_uptake_per_unit_growth": nutrient_uptake,
                    "water_consumption_per_day": water_consumption,
                    "yield_per_unit_growth": yield_per_growth,
                    "max_growth_stage": max_growth_stage,
                    "description": crop_description
                }
                st.success(f"✅ Crop template '{crop_name}' saved successfully!")
            else:
                st.error("❌ Please enter a crop name.")
    
    # Display existing templates
    if st.session_state.crop_templates:
        st.subheader("📋 Existing Crop Templates")
        
        for crop_name, params in st.session_state.crop_templates.items():
            with st.expander(f"🌱 {crop_name}"):
                col1, col2, col3 = st.columns([2, 2, 1])
                
                with col1:
                    st.write(f"**Growth Rate:** {params['growth_rate_per_day']}/day")
                    st.write(f"**Nutrient Uptake:** {params['nutrient_uptake_per_unit_growth']}")
                    st.write(f"**Water Consumption:** {params['water_consumption_per_day']}/day")
                
                with col2:
                    st.write(f"**Yield per Growth:** {params['yield_per_unit_growth']}")
                    st.write(f"**Max Growth Stage:** {params['max_growth_stage']}")
                    if params.get('description'):
                        st.write(f"**Description:** {params['description']}")
                
                with col3:
                    if st.button(f"🗑️ Delete", key=f"del_crop_{crop_name}"):
                        del st.session_state.crop_templates[crop_name]
                        st.rerun()
    else:
        st.info("No crop templates created yet. Create your first template above!")

def show_fish_templates():
    st.header("🐟 Fish Templates")
    st.write("Create and manage fish varieties with custom parameters.")
    
    # Create new fish template
    with st.expander("➕ Create New Fish Template", expanded=True):
        col1, col2 = st.columns(2)
        
        with col1:
            fish_name = st.text_input("Fish Name", placeholder="e.g., Tilapia, Salmon, Crab")
            growth_rate = st.number_input("Growth Rate (per day)", min_value=0.001, max_value=0.5, value=0.02, step=0.001,
                                        help="How much the fish grows each day")
            waste_production = st.number_input("Waste Production (per day per unit size)", min_value=0.001, max_value=0.2, value=0.05, step=0.001,
                                             help="Amount of ammonia produced daily per unit of fish size")
            oxygen_consumption = st.number_input("Oxygen Consumption (per day per unit size)", min_value=0.001, max_value=0.1, value=0.01, step=0.001,
                                               help="Amount of oxygen consumed daily per unit of fish size")
        
        with col2:
            max_size = st.number_input("Maximum Size", min_value=0.5, max_value=20.0, value=5.0, step=0.1,
                                     help="Maximum size the fish can reach before harvest")
            
            st.markdown("**Fish Description:**")
            fish_description = st.text_area("Description (optional)", placeholder="Describe this fish variety...")
        
        if st.button("💾 Save Fish Template"):
            if fish_name:
                st.session_state.fish_templates[fish_name] = {
                    "growth_rate_per_day": growth_rate,
                    "waste_production_per_day": waste_production,
                    "oxygen_consumption_per_day": oxygen_consumption,
                    "max_size": max_size,
                    "description": fish_description
                }
                st.success(f"✅ Fish template '{fish_name}' saved successfully!")
            else:
                st.error("❌ Please enter a fish name.")
    
    # Display existing templates
    if st.session_state.fish_templates:
        st.subheader("📋 Existing Fish Templates")
        
        for fish_name, params in st.session_state.fish_templates.items():
            with st.expander(f"🐟 {fish_name}"):
                col1, col2, col3 = st.columns([2, 2, 1])
                
                with col1:
                    st.write(f"**Growth Rate:** {params['growth_rate_per_day']}/day")
                    st.write(f"**Waste Production:** {params['waste_production_per_day']}/day/unit")
                    st.write(f"**Oxygen Consumption:** {params['oxygen_consumption_per_day']}/day/unit")
                
                with col2:
                    st.write(f"**Maximum Size:** {params['max_size']}")
                    if params.get('description'):
                        st.write(f"**Description:** {params['description']}")
                
                with col3:
                    if st.button(f"🗑️ Delete", key=f"del_fish_{fish_name}"):
                        del st.session_state.fish_templates[fish_name]
                        st.rerun()
    else:
        st.info("No fish templates created yet. Create your first template above!")

def show_biosphere_setup():
    st.header("🔧 Biosphere Setup")
    st.write("Configure your artificial biosphere system parameters.")
    
    # Check if templates exist
    if not st.session_state.crop_templates and not st.session_state.fish_templates:
        st.warning("⚠️ Please create at least one crop template and one fish template before setting up your biosphere.")
        return
    
    # Biosphere configuration
    with st.expander("🌍 System Configuration", expanded=True):
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Water System")
            water_volume = st.number_input("Water Volume (liters)", min_value=100, max_value=10000, value=1000, step=50,
                                         help="Total water volume in the system")
            daily_water_top_up = st.number_input("Daily Water Top-up (liters)", min_value=0, max_value=100, value=10, step=1,
                                                help="Amount of fresh water added daily")
            water_evaporation_rate = st.number_input("Water Evaporation Rate (%/day)", min_value=0.0, max_value=5.0, value=1.0, step=0.1,
                                                   help="Percentage of water lost to evaporation daily") / 100
        
        with col2:
            st.subheader("Chemical Parameters")
            nitrification_rate = st.number_input("Nitrification Rate", min_value=0.01, max_value=0.5, value=0.1, step=0.01,
                                                help="Rate of ammonia/nitrite conversion by bacteria")
            denitrification_rate = st.number_input("Denitrification Rate", min_value=0.01, max_value=0.2, value=0.05, step=0.01,
                                                 help="Rate of nitrate loss from the system")
            initial_ph = st.number_input("Initial pH", min_value=6.0, max_value=8.5, value=7.0, step=0.1,
                                       help="Starting pH of the water")
    
    # Add organisms to biosphere
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🌱 Add Crops")
        if st.session_state.crop_templates:
            selected_crop = st.selectbox("Select Crop Template", list(st.session_state.crop_templates.keys()))
            crop_quantity = st.number_input("Number of Crops", min_value=1, max_value=50, value=1, step=1)
            
            if st.button("➕ Add Crops to Biosphere"):
                if st.session_state.biosphere is None:
                    st.session_state.biosphere = Biosphere(
                        water_volume=water_volume,
                        nitrification_rate=nitrification_rate,
                        denitrification_rate=denitrification_rate,
                        water_evaporation_rate=water_evaporation_rate,
                        daily_water_top_up=daily_water_top_up,
                        initial_ph=initial_ph
                    )
                
                template = st.session_state.crop_templates[selected_crop]
                for i in range(crop_quantity):
                    crop = Crop(
                        name=f"{selected_crop}_{i+1}",
                        growth_rate_per_day=template["growth_rate_per_day"],
                        nutrient_uptake_per_unit_growth=template["nutrient_uptake_per_unit_growth"],
                        water_consumption_per_day=template["water_consumption_per_day"],
                        yield_per_unit_growth=template["yield_per_unit_growth"],
                        max_growth_stage=template["max_growth_stage"]
                    )
                    st.session_state.biosphere.add_crop(crop)
                
                st.success(f"✅ Added {crop_quantity} {selected_crop} crops to the biosphere!")
        else:
            st.info("No crop templates available. Create crop templates first.")
    
    with col2:
        st.subheader("🐟 Add Fish")
        if st.session_state.fish_templates:
            selected_fish = st.selectbox("Select Fish Template", list(st.session_state.fish_templates.keys()))
            fish_quantity = st.number_input("Number of Fish", min_value=1, max_value=50, value=1, step=1)
            
            if st.button("➕ Add Fish to Biosphere"):
                if st.session_state.biosphere is None:
                    st.session_state.biosphere = Biosphere(
                        water_volume=water_volume,
                        nitrification_rate=nitrification_rate,
                        denitrification_rate=denitrification_rate,
                        water_evaporation_rate=water_evaporation_rate,
                        daily_water_top_up=daily_water_top_up,
                        initial_ph=initial_ph
                    )
                
                template = st.session_state.fish_templates[selected_fish]
                for i in range(fish_quantity):
                    fish = Fish(
                        name=f"{selected_fish}_{i+1}",
                        growth_rate_per_day=template["growth_rate_per_day"],
                        waste_production_per_day=template["waste_production_per_day"],
                        oxygen_consumption_per_day=template["oxygen_consumption_per_day"],
                        max_size=template["max_size"]
                    )
                    st.session_state.biosphere.add_fish(fish)
                
                st.success(f"✅ Added {fish_quantity} {selected_fish} fish to the biosphere!")
        else:
            st.info("No fish templates available. Create fish templates first.")
    
    # Reset biosphere
    if st.session_state.biosphere is not None:
        st.subheader("🔄 Reset System")
        if st.button("🗑️ Reset Biosphere", type="secondary"):
            st.session_state.biosphere = None
            st.session_state.simulation_running = False
            st.success("✅ Biosphere reset successfully!")

def get_recommendation_from_status(status):
    PH_MIN, PH_MAX = 6.5, 8.0
    DO_MIN = 4
    AMMONIA_MAX = 0.5
    NITRATE_MAX = 150
    TEMP_MIN, TEMP_MAX = 20, 30
    # Extract values from status
    ph = status.get('ph', 7.0)
    ammonia = status.get('ammonia', 0.1)
    nitrate = status.get('nitrate', 50.0)
    temperature = status.get('water_temperature', status.get('temperature', 25.0))
    # Estimate dissolved oxygen if available (not in your status by default)
    dissolved_oxygen = status.get('dissolved_oxygen', 5.0)
    # Count crops and fish
    num_crops = len(status.get('crops', []))
    num_fish = len(status.get('fishes', []))
    # Rule-based logic
    if (
        (PH_MIN <= ph <= PH_MAX) and
        (dissolved_oxygen > DO_MIN) and
        (ammonia < AMMONIA_MAX) and
        (nitrate < NITRATE_MAX) and
        (TEMP_MIN <= temperature <= TEMP_MAX)
    ):
        if num_crops > 0 and num_fish / num_crops > 2:
            return 'Add more plants to balance the fish load.'
        elif num_fish > 0 and num_crops / num_fish > 2:
            return 'Add more fish to balance the plant load.'
        else:
            return 'Ecosystem is balanced.'
    if ammonia >= AMMONIA_MAX:
        return 'Reduce fish or increase plants: Ammonia is too high.'
    if dissolved_oxygen <= DO_MIN:
        return 'Increase aeration: Dissolved oxygen is too low.'
    if ph < PH_MIN:
        return 'Increase pH: pH is too low.'
    if ph > PH_MAX:
        return 'Decrease pH: pH is too high.'
    if nitrate >= NITRATE_MAX:
        return 'Add more plants: Nitrate is too high.'
    return 'Ecosystem is balanced.'

def show_simulation_dashboard():
    st.header("📊 Simulation Dashboard")
    
    if st.session_state.biosphere is None:
        st.warning("⚠️ No biosphere configured. Please set up your biosphere first.")
        return
    
    # Simulation controls
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        if st.button("▶️ Run 1 Day", type="primary"):
            st.session_state.biosphere.simulate_day()
            st.rerun()
    
    with col2:
        if st.button("⏩ Run 7 Days"):
            for _ in range(7):
                st.session_state.biosphere.simulate_day()
            st.rerun()
    
    with col3:
        if st.button("⏭️ Run 30 Days"):
            for _ in range(30):
                st.session_state.biosphere.simulate_day()
            st.rerun()
    
    with col4:
        auto_run = st.checkbox("🔄 Auto-run", value=st.session_state.simulation_running)
        if auto_run != st.session_state.simulation_running:
            st.session_state.simulation_running = auto_run
            if auto_run:
                st.rerun()
    
    # Auto-run logic
    if st.session_state.simulation_running:
        st.session_state.biosphere.simulate_day()
        st.rerun()
    
    # Get current status
    status = st.session_state.biosphere.get_status()
    
    # Display current status
    st.subheader(f"📅 Day {status['current_day']} - System Status")
    
    # Water parameters
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric("💧 Water Volume", f"{status['water_volume']} L")
    with col2:
        st.metric("🟡 Ammonia", f"{status['ammonia']:.2f}")
    with col3:
        st.metric("🟠 Nitrite", f"{status['nitrite']:.2f}")
    with col4:
        st.metric("🟢 Nitrate", f"{status['nitrate']:.2f}")
    with col5:
        st.metric("⚖️ pH", f"{status['ph']:.1f}")
    
    # Organisms status
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🌱 Crops Status")
        if status['crops']:
            for crop in status['crops']:
                with st.expander(f"{crop['name']} - {crop['progress_percentage']:.1f}% grown"):
                    col_a, col_b = st.columns(2)
                    with col_a:
                        st.write(f"**Growth Stage:** {crop['current_growth_stage']:.2f} / {crop['max_growth_stage']}")
                        st.write(f"**Health:** {crop['health']:.2f}")
                    with col_b:
                        st.progress(crop['progress_percentage'] / 100)
                        if crop['current_growth_stage'] >= crop['max_growth_stage'] and not crop['is_harvested']:
                            if st.button(f"🌾 Harvest {crop['name']}", key=f"harvest_crop_{crop['name']}"):
                                result = st.session_state.biosphere.harvest_crop(crop['name'])
                                st.success(result)
                                st.rerun()
        else:
            st.info("No crops in the biosphere.")
    
    with col2:
        st.subheader("🐟 Fish Status")
        if status['fishes']:
            for fish in status['fishes']:
                with st.expander(f"{fish['name']} - {fish['progress_percentage']:.1f}% grown"):
                    col_a, col_b = st.columns(2)
                    with col_a:
                        st.write(f"**Size:** {fish['current_size']:.2f} / {fish['max_size']}")
                        st.write(f"**Health:** {fish['health']:.2f}")
                    with col_b:
                        st.progress(fish['progress_percentage'] / 100)
                        if fish['current_size'] >= fish['max_size'] and not fish['is_harvested']:
                            if st.button(f"🎣 Harvest {fish['name']}", key=f"harvest_fish_{fish['name']}"):
                                result = st.session_state.biosphere.harvest_fish(fish['name'])
                                st.success(result)
                                st.rerun()
        else:
            st.info("No fish in the biosphere.")
    
    # Yield summary
    if status['total_crop_yield'] or status['total_fish_yield']:
        st.subheader("📈 Total Yields")
        col1, col2 = st.columns(2)
        
        with col1:
            if status['total_crop_yield']:
                st.write("**🌾 Crop Yields:**")
                for crop_type, yield_amount in status['total_crop_yield'].items():
                    st.write(f"- {crop_type}: {yield_amount:.2f} units")
        
        with col2:
            if status['total_fish_yield']:
                st.write("**🐟 Fish Yields:**")
                for fish_type, yield_amount in status['total_fish_yield'].items():
                    st.write(f"- {fish_type}: {yield_amount:.2f} units")

    # Add suggestion box based on current status
    suggestion = get_recommendation_from_status(status)
    st.info(f"💡 Suggestion: {suggestion}")

def show_save_load_system():
    st.header("💾 Save/Load System")
    st.write("Save your biosphere configuration and simulation state, or load a previously saved system.")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("💾 Save System")
        
        if st.session_state.biosphere is not None:
            save_name = st.text_input("Save Name", placeholder="My Biosphere Setup")
            
            if st.button("💾 Save Current System"):
                if save_name:
                    save_data = {
                        "biosphere": st.session_state.biosphere.to_dict(),
                        "crop_templates": st.session_state.crop_templates,
                        "fish_templates": st.session_state.fish_templates,
                        "save_name": save_name
                    }
                    
                    # Convert to JSON for download
                    json_data = json.dumps(save_data, indent=2)
                    
                    st.download_button(
                        label="📥 Download Save File",
                        data=json_data,
                        file_name=f"{save_name.replace(' ', '_')}_biosphere.json",
                        mime="application/json"
                    )
                    st.success("✅ Save file ready for download!")
                else:
                    st.error("❌ Please enter a save name.")
        else:
            st.info("No biosphere to save. Set up a biosphere first.")
    
    with col2:
        st.subheader("📂 Load System")
        
        uploaded_file = st.file_uploader("Choose a save file", type="json")
        
        if uploaded_file is not None:
            try:
                save_data = json.load(uploaded_file)
                
                st.write(f"**Save Name:** {save_data.get('save_name', 'Unknown')}")
                
                if st.button("📂 Load System"):
                    # Load templates
                    st.session_state.crop_templates = save_data.get("crop_templates", {})
                    st.session_state.fish_templates = save_data.get("fish_templates", {})
                    
                    # Load biosphere
                    if "biosphere" in save_data:
                        st.session_state.biosphere = Biosphere.from_dict(save_data["biosphere"])
                    
                    st.success("✅ System loaded successfully!")
                    st.rerun()
                    
            except Exception as e:
                st.error(f"❌ Error loading file: {str(e)}")

if __name__ == "__main__":
    main()

