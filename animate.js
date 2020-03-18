const elements = document.getElementsByClassName("circle");

const SPACING = 120;

const DIRECTIONS = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

const HEALTH_STATUSES = {
    HEALTHY: 'HEALTHY',
    SICK: 'SICK',
    INFECTED: 'INFECTED'
}

class Person {
    constructor(healthStatus,) {
        this.healthStatus = healthStatus;
        if (healthStatus === HEALTH_STATUSES.INFECTED) {
            this.direction = DIRECTIONS.RIGHT
        } else {
            this.direction = DIRECTIONS.LEFT;
        }
    }
}


const PersonsArr = [
    new Person(HEALTH_STATUSES.INFECTED),
    new Person(HEALTH_STATUSES.HEALTHY),
    new Person(HEALTH_STATUSES.HEALTHY),
    new Person(HEALTH_STATUSES.HEALTHY)
]

const sickIndexes = [
    'SICK_ON_RUN',
    'HEALTHY',
    'HEALTHY',
    'HEALTHY'
]

const directionIndexes = [
    'RIGHT',
    'LEFT',
    'LEFT',
    'LEFT'
]

const checkForCollision = () => {
    const xPositions = [];
    for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        const startIndex = 11;
        const stopIndex = elem.style.transform.indexOf('px');
        const xPosition = Math.floor(elem.style.transform.substring(startIndex, stopIndex));
        xPositions.push(xPosition);
    }

    for (let i = 0; i < elements.length - 1; i++) {
        const xPosOfCurrentElem = xPositions[i];
        const xPostOfNextElem = xPositions[i + 1];
        if (xPosOfCurrentElem >= xPostOfNextElem) {
            console.log("DETECTED COLLISION");
            sickIndexes[i + 1] = 'SICK_ON_RUN';
            directionIndexes[i] = directionIndexes[i + 1] === 'LEFT' ? 'LEFT' : 'RIGHT';
            directionIndexes[i + 1] = directionIndexes[i + 1] === 'LEFT' ? 'RIGHT' : 'LEFT';
            sickIndexes[i] = 'SICK';
        }
    }
}

const drawHealthIndicator = (i) => {
    console.log(PersonsArr[i]);
    console.log(i);
    if (PersonsArr[i].healthStatus === HEALTH_STATUSES.HEALTHY) {
        elements[i].style.backgroundColor = 'green';
    } else {
        elements[i].style.backgroundColor = 'red';
    }
}

const initialDraw = () => {
    for (let i = 0; i < elements.length; i++) {
        drawHealthIndicator(i);
        const elem = elements[i];
        elem.style.transform = 'translateX(' + (SPACING * i) + 'px)';
    }
}

const extractPositionFromTranslateX = (elem) => {
    const startIndex = 11;
    const stopIndex = elem.style.transform.indexOf('px');
    return Number(elem.style.transform.substring(startIndex, stopIndex));
}

const directionChange = (xPosition, i) => {
    if (xPosition <= 0) {
        directionIndexes[i] = 'RIGHT';
    }
    if (xPosition >= 420) {
        directionIndexes[i] = 'LEFT';
    }
}

const draw = (timeFraction) => {
    if (timeFraction <= 0) {
        initialDraw();
    } else {
        checkForCollision();

        for (let i = 0; i < elements.length; i++) {
            const elem = elements[i];
            drawHealthIndicator(i);

            const xPosition = extractPositionFromTranslateX(elem);
            directionChange(xPosition, i);

            const speed = sickIndexes[i] === 'SICK_ON_RUN' ? 1 : 0.1;

            const newXPosition = directionIndexes[i] === 'RIGHT' ? xPosition + speed : xPosition - speed;
            elem.style.transform = 'translateX(' + newXPosition + 'px)';

        }
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
    draw(timeFraction);

    if (timeFraction < 1) {
        window.requestAnimationFrame(step);
    }
}

start = performance.now();
requestAnimationFrame(step)
