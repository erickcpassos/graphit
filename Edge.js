class Edge {
    constructor(source, destination, weight="", isDirected=false, curveValue=100, selfLoopIndex=0) {
        this.source = source;
        this.destination = destination;
        this.isDirected = isDirected;
        this.weight = weight;
        this.curveValue = curveValue;
        this.edgePointSize = 10;
        this.selfLoopIndex = selfLoopIndex;
        this.selfLoopRadius = 25;
    }

    display() {
        push();

            strokeWeight(2);
            let v1 = nodes[this.source], v2 = nodes[this.destination];
            let vcenter = {x: canvasWidth/2, y: canvasWidth/2};
            push(); 

                if(v1 == v2) { // self-loop

                    let theta = atan2(v1.y-vcenter.y, v1.x-vcenter.x);
                    let loopRadius = this.selfLoopRadius*this.selfLoopIndex;

                    translate(v1.x+loopRadius*cos(theta), v1.y+loopRadius*sin(theta));
                    beginShape();
                        fill(0,0,0,0);
                        circle(0, 0, 2*loopRadius);
                    endShape();

                    translate(loopRadius*cos(theta), loopRadius*sin(theta));
                    fill(0);
                    if(mode === "DELETE") circle(0, 0, this.edgePointSize);
                    textSize(16);
                    text(this.weight, 10*cos(theta), 10*sin(theta));

                } else {
                    let xa = nodes[this.source].x, xb = nodes[this.destination].x;
                    let ya = nodes[this.source].y, yb = nodes[this.destination].y;
                    let xm = (nodes[this.source].x + nodes[this.destination].x)/2, ym = (nodes[this.source].y + nodes[this.destination].y)/2;
                    
                    const d = 20;
                    let t = atan2(yb-ya, xb-xa) + HALF_PI;

                    beginShape();
                        vertex(v1.x, v1.y);
                        noFill();
                        
                        quadraticVertex(xm+cos(t)*this.curveValue, ym+sin(t)*this.curveValue, v2.x, v2.y);
                    endShape();


                    translate(xm, ym);
                    fill(0)
                    if(mode === "DELETE") ellipse(cos(t)*(this.curveValue)/2, sin(t)*(this.curveValue)/2, this.edgePointSize, this.edgePointSize);
                    textSize(16);
                    text(this.weight, cos(t)*(this.curveValue+30)/2, sin(t)*(this.curveValue+30)/2);
                }
            pop();

            
            
            if(this.isDirected) {
                push();
                    var angle = atan2(nodes[this.source].y - nodes[this.destination].y, nodes[this.source].x - nodes[this.destination].x); //gets the angle of the line
                    translate(nodes[this.destination].x, nodes[this.destination].y); //translates to the destination vertex
                    rotate(angle-HALF_PI); //rotates the arrow point
                    let offset = nodeRadius*0.8;
                    fill(0, 0, 0);
                    triangle(-offset*0.25, offset, offset*0.25, offset, 0, offset*0.5); //draws the arrow point as a triangle
                pop();
            }
        
        pop();
    }

    wasClicked(x, y) {

        let xa = nodes[this.source].x, xb = nodes[this.destination].x;
        let ya = nodes[this.source].y, yb = nodes[this.destination].y;

        if(this.source == this.destination) { // is a self loop

            let vcenter = {x: canvasWidth/2, y: canvasWidth/2};

            let theta = atan2(ya-vcenter.y, xa-vcenter.x);
            let loopRadius = this.selfLoopRadius*this.selfLoopIndex;
            let xv = xa+2*loopRadius*cos(theta), yv = ya+2*loopRadius*sin(theta);
            let dist = sqrt((xv-x)*(xv-x) + (yv-y)*(yv-y));

            return (dist <= this.edgePointSize)

        } else {
            let xm = (nodes[this.source].x + nodes[this.destination].x)/2, ym = (nodes[this.source].y + nodes[this.destination].y)/2;
        
            let t = atan2(yb-ya, xb-xa) + HALF_PI;
            let xv = xm+cos(t)*(this.curveValue)/2, yv = ym+sin(t)*(this.curveValue)/2
            let dist = sqrt((xv-x)*(xv-x) + (yv-y)*(yv-y));

            return (dist <= this.edgePointSize);
        }

        
    }
}
