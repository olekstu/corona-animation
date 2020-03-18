const elements = document.getElementsByClassName("circle");

const DIRECTIONS = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

const HEALTH_STATUSES = {
    HEALTHY: 'HEALTHY',
    SICK: 'SICK',
    FRONTLINE: 'FRONTLINE'
}


class Person {
    constructor(healthStatus, xPosition) {
        this.healthStatus = healthStatus;
        this.xPosition = xPosition;
        if (healthStatus === HEALTH_STATUSES.FRONTLINE) {
            this.direction = DIRECTIONS.RIGHT
        } else {
            this.direction = DIRECTIONS.LEFT;
        }
    }

    move() {
        const speed = this.healthStatus === HEALTH_STATUSES.FRONTLINE ? 1 : 0.1;
        this.xPosition = this.direction === DIRECTIONS.RIGHT ? this.xPosition + speed : this.xPosition - speed;
        if (this.xPosition <= 0) {
            this.direction = DIRECTIONS.RIGHT;
        }
        if (this.xPosition >= 420) {
            this.direction = DIRECTIONS.LEFT;
        }
    }

    becomesInfected() {
        this.healthStatus = HEALTH_STATUSES.FRONTLINE;
        this.direction = DIRECTIONS.RIGHT;
    }

    staysSick() {
        this.healthStatus = HEALTH_STATUSES.SICK;
        this.direction = DIRECTIONS.LEFT;
    }

    collided(adjacentPerson) {
        return this.xPosition >= adjacentPerson.xPosition;
    }
}

class Population {
    constructor() {
        this.inhabitants = [
            new Person(HEALTH_STATUSES.FRONTLINE, 0),
            new Person(HEALTH_STATUSES.HEALTHY, 60),
            new Person(HEALTH_STATUSES.HEALTHY, 120),
            new Person(HEALTH_STATUSES.HEALTHY, 180)
        ]
    }

    move() {
        this.inhabitants.forEach(person => person.move());
    }

    checkIfVirusIsSpread() {
        for (let i = 0; i < this.inhabitants.length - 1; i++) {
            const currentPerson = this.inhabitants[i];
            const adjacentPerson = this.inhabitants[i + 1];
            if (currentPerson.collided(adjacentPerson)) {
                console.log("DETECTED COLLISION");
                adjacentPerson.becomesInfected(currentPerson);
                currentPerson.staysSick();
            }
        }
    }
}

const population = new Population();

const drawHealthIndicator = (i) => {
    if (population.inhabitants[i].healthStatus === HEALTH_STATUSES.HEALTHY) {
        elements[i].style.backgroundColor = 'green';
    } else {
        elements[i].style.backgroundColor = 'red';
    }
}

const drawMovement = (i) => {
    elements[i].style.transform = 'translateX(' + population.inhabitants[i].xPosition + 'px)';
}

const draw = () => {
    for (let i = 0; i < elements.length; i++) {
        drawHealthIndicator(i);
        drawMovement(i);
    }
}


let start = null;
const DURATION = 20000;
const step = (timestamp) => {
    const progress = timestamp - start;
    let timeFraction = (progress - start) / DURATION;

    if (timeFraction > 1) {
        timeFraction = 1
    }

    population.move();
    population.checkIfVirusIsSpread();
    draw();

    if (timeFraction < 1) {
        window.requestAnimationFrame(step);
    }
}

start = performance.now();
requestAnimationFrame(step)
