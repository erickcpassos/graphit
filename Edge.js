class Edge {
    constructor(source, destination, weight="", isDirected=false, curveValue=100) {
        this.source = source;
        this.destination = destination;
        this.isDirected = isDirected;
        this.weight = weight;
        this.curveValue = curveValue;
    }

    display() {
        push();

            strokeWeight(2);
            let v1 = nodes[this.source], v2 = nodes[this.destination];

            push(); 


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
                textSize(16);
                fill(0)
                text(this.weight, cos(t)*(this.curveValue+30)/2, sin(t)*(this.curveValue+30)/2);
                
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
        let n1 = nodes[this.source], n2 = nodes[this.destination];
        if(n1.y < n2.y) {
            [n1, n2] = [n2, n1];
        }

        if(x < Math.min(n1.x, n2.x) || x > Math.max(n1.x, n2.x) || y < Math.min(n1.y, n2.y) || y > Math.max(n1.y, n2.y)) return false;

        const precision = 0.000000001;
        let deltaY = n2.y-n1.y, deltaX = (n2.x == n1.x ? precision : n2.x-n1.x);
        let m = deltaY/deltaX;
        let b = n1.y - m*n1.x;
        // y = mx + b
        let foundY = m*x + b;


        const acceptedDiff = 30;
        if(abs(y - foundY) <= acceptedDiff) {
            return true;
        } else {
            return false;
        }
    }
}
