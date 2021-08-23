import Graph from "react-graph-vis";
import {useState} from 'react';
import { queryByTestId } from "@testing-library/react";

export function GraphComponent() {

  const adj = [
    {edges: [{id: 1, weight: 1}, {id: 14, weight: 2}, {id: 7, weight: 2}]}, //0
    {edges: [{id: 2, weight: 7}, {id: 13, weight: 2}]}, // 1
    {edges: [{id: 10, weight: 4}, {id: 22, weight: 7}]},// 2
    {edges: [{id: 6, weight: 3}, {id: 15, weight: 5}]},// 3
    {edges: [{id: 3, weight: 2}, {id: 16, weight: 4}]}, // 4
    {edges: [{id: 4, weight: 2}, {id: 18, weight: 3}, {id: 21, weight: 3}]}, // 5
    {edges: [{id: 7, weight: 1}, {id: 24, weight: 4}]}, // 6
    {edges: [{id: 8, weight: 8}, {id: 15, weight: 3}]}, // 7
    {edges: [{id: 9, weight: 4}, {id: 22, weight: 4}]}, // 8
    {edges: [{id: 17, weight: 5}, {id: 19, weight: 8}]}, // 9
    {edges: [{id: 25, weight: 3}, {id: 13, weight: 8}]}, // 10
    {edges: [{id: 18, weight: 6}, {id: 20, weight: 7}]}, // 11
    {edges: [{id: 11, weight: 2}, {id: 23, weight: 1}]}, // 12
    {edges: [{id: 12, weight: 3}]}, // 13
    {edges: [{id: 3, weight: 7}, {id: 17, weight: 2}]}, // 14
    {edges: [{id: 13, weight: 5}, {id: 24, weight: 3}]}, // 15
    {edges: [{id: 14, weight: 7}, {id: 19, weight: 1}]}, // 16
    {edges: [{id: 11, weight: 3}, {id: 16, weight: 4}]}, // 17
    {edges: [{id: 15, weight: 4}, {id: 12, weight: 5}]}, // 18
    {edges: [{id: 18, weight: 1}, {id: 26, weight: 6}]}, // 19
    {edges: [{id: 8, weight: 2}, {id: 24, weight: 7}]}, // 20
    {edges: [{id: 20, weight: 1}, {id: 19, weight: 8}]}, // 21
    {edges: [{id: 25, weight: 8}]}, // 22
    {edges: [{id: 22, weight: 6}, {id: 11, weight: 8}]}, // 23
    {edges: [{id: 12, weight: 6}, {id: 9, weight: 8}]}, // 24
    {edges: [{id: 24, weight: 3}]}, // 25
    {edges: [{id: 10, weight: 3}, {id: 15, weight: 1}]} // 26
  ]

  const buildNodes = () => {
    const nodes = []
    for (var i = 0; i < adj.length; i++) {
      nodes.push({id: i, color: "gray"});
    }
    return nodes;
   
  }

  const buildEdges = () => {
    const edges = []
    for (var i = 0; i < adj.length; i++) {
      for(var j = 0; j < adj[i].edges.length; j++) {
        edges.push({from: i, to: adj[i].edges[j].id, label: `${adj[i].edges[j].weight}`});
      }
    }
    return edges;
  }

  var red = true;

  var blue = false;

  var clean = false;

  var explored;

  const getMin = (queue) => {
    var min = 100000;
    var index = -1;

    for (var i = 0; i < queue.length; i++) {
      if(explored[queue[i].to] >= 0) {
        queue.splice(i, 1);
        i--;
        continue;
      }

      if (queue[i].dist < min) {
        min = queue[i].dist;
        index = i;
      }
    }

    if (index != -1) {
    return queue[index];
    } else { 
      return null;
    }
  }

  const shortestPath = () => { // Dijkstra
    const source = graph.nodes.filter(node => {return (node.color == "red")})[0].id;
    const target = graph.nodes.filter(node => {return (node.color == "blue")})[0].id;
    
    var queue = [];
    var distance = Array(adj.length);
    explored = Array(adj.length).fill(-1);

    var v = source;
    distance[v] = 0;
    explored[v] = v;
    
    for(var count = 0; count < adj.length - 1; count++) {
      for (var i = 0; i < adj[v].edges.length; i++) {
        let u = adj[v].edges[i];

        if (explored[u.id] != -1) {
          continue;
        }

        queue.push({from: v, to: u.id, dist: distance[v] + u.weight})
      }

      let node = getMin(queue);
      if (node == null) {
        break;
      }
      v = node.to;

      distance[v] = node.dist;
      explored[v] = node.from;
    }

    // Paint path
    var x = target;
    if (explored[x] >= 0) {
      blue = false;
      red = true;
      clean = true;
      graph.nodes[x].color = "pink";
      while(x != source) {
        x = explored[x];
        graph.nodes[x].color = "pink";
      }
    } else {
      console.log("Não há caminho até o destino!");
    }
    setState(({ graph, ...rest }) => {
      return {
        graph,
        ...rest
      }
    });
  }


  const changeState = (id) => {
    if (clean) {
      for(var i = 0; i < adj.length; i++) {
        graph.nodes[i].color = "gray";
      }
      clean = false;
    }

    const node = graph.nodes.find(node => {return node.id == id});
    const color = node.color;

    if (color == "gray" && red) {
      node.color = "red";
      red = false;
      blue = true;
    } else if (color == "gray" && blue) {
      node.color = "blue";
      blue = false;
    } else if (color == "blue") {
      node.color = "gray";
      blue = true;
    } else if (color == "red") {
      red = true;
      node.color = "gray";
    } else {
      node.color = "gray";
    }

    setState(({ graph, ...rest }) => {
      return {
        graph,
        ...rest
      }
    });
  }


  const options = {
    layout: {
      hierarchical: false,
      randomSeed: 16,
    },
    edges: {
      color: "#000000"
    },
    nodes: {
        fixed: false
    },
    height: "100%",
    interaction: {
        selectConnectedEdges: false,
        multiselect: true
    },
    physics: {
      enabled: false
    }
  };

  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: buildNodes(),
      edges: buildEdges()
    },
    events: {
      selectNode: ({ nodes}) => {
        changeState(nodes[0]);
      },
      doubleClick: () => {
        if (!blue && !red) {
          shortestPath();
        }
      }
    }
  })

  const { graph, events } = state;

  return (
      <Graph
      key = {Math.random()}
        graph={graph}
        options={options}
        events={events}
        style={{
          width: '100%',
          height: '100%',
        }}
        getNetwork={network => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
  );
}

