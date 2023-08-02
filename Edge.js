class Edge {
    constructor(source, destination, weight="", isDirected=false) {
        this.source = source;
        this.destination = destination;
        this.isDirected = isDirected;
        this.weight = weight;
    }

    display() {
        push();

            strokeWeight(2);
            line(nodes[this.source].x, nodes[this.source].y, nodes[this.destination].x, nodes[this.destination].y)


            // TODO: mostrar texto na reta perpendicular
            // TODO: rever questão de multiedge com pesos
            push(); 
                // let dx = (nodes[this.source].x - nodes[this.destination].x), dy = (nodes[this.source].y - nodes[this.destination].y);
                // if(dx == 0) dx = 0.0000001;
                // if(dy == 0) dy = 0.0000001;

                // let m1 = dy/dx, m2 = -(1/m1);

                let xm = (nodes[this.source].x + nodes[this.destination].x)/2, ym = (nodes[this.source].y + nodes[this.destination].y)/2;

                // let b1 = nodes[this.source].y - m1 * nodes[this.source].x;
                // let b2 = b1 - xm * (m2-m1);


                // let offsetX = 10;
                // let offsetY = m2*offsetX + b2;
            
                let offsetX = 10, offsetY = 10;
                translate(xm, ym);
                textSize(14);
                text(this.weight, offsetX, offsetY);
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

        // console.log([n1.x, n1.y], [n2.x, n2.y]);
        // console.log({m, foundY, y});

        const acceptedDiff = 30;
        if(abs(y - foundY) <= acceptedDiff) {
            return true;
        } else {
            return false;
        }
    }
}
