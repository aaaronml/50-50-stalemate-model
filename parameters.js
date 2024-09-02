// this object defines the parameters of the model
// - constants
// - variables (connected to sliders) properties range and default
// - choices (connected to radios) properties choices and default
// - switches (connected to toggles) property default
// utils.js provides methods for extracting various types of parameters for later use

export default {
		L:100,
		boundary:"periodic",
		N:{hex:60,square:16},
		initial_yes:0.4,
		initial_no:0.4,
		T_trajectory:500,
		T_relax:50,
	
		prob_convince: {
			range:[0,1],
		default:0.5
		},
		prob_repel: {
			range:[0,1],
		default:0.2
		},
		prob_doubt:{
			range : [0,1],
		default : 0.1
		},
		
		lattice : {
			choices:["square","hexagonal"],
		default:0
		}
}

