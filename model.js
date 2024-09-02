// this is a module that contains most of the explorable specific code
// the "math" of the explorable, the model itself, without the elements
// of visualization which are done in viz.js

import param from "./parameters.js"
import {each,filter} from "lodash-es"
import * as lattices from "lattices"

const L = param.L;

// typically objects needed for the explorable
// are defined here

var agents = [];
var trajectory = [];

// the initialization function, this is bundled in simulation.js with the initialization of
// the visualization and effectively executed in index.js when the whole explorable is loaded

const initialize = () => {

	// set/reset timer
	param.timer={}; param.tick=0;

	// make agents
	const N = param.lattice.widget.value()==1 ? param.N.hex : param.N.square
	const s = lattices[param.lattice.widget.value()==1?"hex":"square"](N)
		.boundary(param.boundary)
	
	agents = s.nodes;
	
	each(agents,a=>{
		const X = Math.random()
		if(X < param.initial_yes + param.initial_no) {
			if (X < param.initial_yes){
				a.state = "yes"
			} else {
				a.state = "no"
			}
		} else {
			a.state="doubt";
		}

	})
	
	trajectory = [{t:param.tick,x:filter(agents,a=>a.state=="yes").length,y:filter(agents,a=>a.state=="no").length}]
	
};

// the go function, this is bundled in simulation.js with the go function of
// the visualization, typically this is the iteration function of the model that
// is run in the explorable.

const go  = () => {
	
	param.tick++;
	
	const yes = filter(agents,d=>d.state=="yes");
	const no = filter(agents,d=>d.state=="no");
	
	//const lattice_correct = param.lattice.widget.value()==0 ? 1 : 8.0 / 6.0
	
	const alpha = param.prob_convince.widget.value();
	const beta =  param.prob_repel.widget.value();
	const gamma = param.prob_doubt.widget.value();

	each(agents,d=>{
		const n = d.neighbors[Math.floor(Math.random()*d.neighbors.length)];
		if(d.state =="yes"){
		const r=Math.random();
		if (n.state == "doubt" && r<alpha*beta) {n.state = "no"}
		else if (n.state=="doubt" && r<1-alpha) {n.state="yes"}
		else if (n.state=="no" && Math.random()<alpha*gamma) {n.state="doubt"}
		else if (n.state=="yes" && Math.random()<alpha*beta*gamma) {n.state="doubt"};
		}
		else if(d.state =="no"){
		const rr=Math.random();
		if (n.state == "doubt" && rr<alpha*beta) {n.state = "yes"}
		else if (n.state=="doubt" && rr<1-alpha) {n.state="no"}
		else if (n.state=="yes" && Math.random()<alpha*gamma) {n.state="doubt"}
		else if (n.state=="no" && Math.random()<alpha*beta*gamma) {n.state="doubt"};

		}
	})
	
	
	
	if (param.tick>param.T_relax){
		trajectory.push({t:param.tick,x:filter(agents,a=>a.state=="yes").length,y:filter(agents,a=>a.state=="no").length,z:filter(agents,a=>a.state=="doubt").length})
	} else {
		trajectory = [{t:param.tick,x:filter(agents,a=>a.state=="yes").length,y:filter(agents,a=>a.state=="no").length,z:filter(agents,a=>a.state=="doubt").length}]
	}
	
	if (trajectory.length>param.T_trajectory) {
		trajectory.shift()
	}
	
}

// the update function is usually not required for running the explorable. Sometimes
// it makes sense to have it, e.g. to update the model, if a parameter is changed,
// e.g. a radio button is pressed. 

const update = () => {
	
	each(agents,x => {x.active = x.index < param.number_of_particles.widget.value() ? true : false})

}

// the three functions initialize, go and update are exported, also all variables
// that are required for the visualization
export {agents,trajectory,initialize,go,update}
