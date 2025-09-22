document.addEventListener('DOMContentLoaded', () => {
    setupHeadingAnimation();
    setupPaddleGame();
    updateCurrentYear();
});

function setupHeadingAnimation() {
    const animatedSubheading = document.getElementById('animated-subheading');
    if (!animatedSubheading) {
        return;
    }

    const textToAnimate = 'search and you shall find';
    let charIndex = 0;
    const typingSpeed = 150;
    const delayBeforeRestart = 2000;

    const typeText = () => {
        if (!animatedSubheading) {
            return;
        }

        if (charIndex < textToAnimate.length) {
            animatedSubheading.textContent += textToAnimate.charAt(charIndex);
            charIndex += 1;
            setTimeout(typeText, typingSpeed);
        } else {
            setTimeout(eraseAndRestart, delayBeforeRestart);
        }
    };

    const eraseAndRestart = () => {
        animatedSubheading.textContent = '';
        charIndex = 0;
        typeText();
    };

    typeText();
}

function setupPaddleGame() {
    const canvas = document.getElementById('pongCanvas');
    if (!canvas || !canvas.getContext) {
        return;
    }

    const ctx = canvas.getContext('2d');

    const paddleConfig = {
        width: 16,
        height: 110,
        margin: 42,
        speed: 3.4
    };

    const createPaddle = (xPosition) => ({
        x: xPosition,
        y: (canvas.height - paddleConfig.height) / 2,
        width: paddleConfig.width,
        height: paddleConfig.height,
        speed: paddleConfig.speed
    });

    const leftPaddle = createPaddle(paddleConfig.margin);
    const rightPaddle = createPaddle(canvas.width - paddleConfig.margin - paddleConfig.width);

    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 9,
        speed: 4.2,
        velocityX: 4.2,
        velocityY: 2.4,
        maxSpeed: 8
    };

    const resetBall = (direction = 1) => {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speed = 4.2;

        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // -30deg to 30deg
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
    };

    resetBall(Math.random() > 0.5 ? 1 : -1);

    const drawBackground = () => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        gradient.addColorStop(0.5, 'rgba(12, 20, 36, 0.95)');
        gradient.addColorStop(1, 'rgba(8, 12, 25, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(66, 255, 203, 0.3)';
        ctx.shadowBlur = 0;
        const segmentHeight = 18;
        const gap = 12;
        for (let y = 0; y < canvas.height; y += segmentHeight + gap) {
            ctx.fillRect(canvas.width / 2 - 2, y, 4, segmentHeight);
        }
    };

    const drawPaddle = (paddle) => {
        ctx.fillStyle = '#42ffcb';
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(66, 255, 203, 0.55)';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.shadowBlur = 0;
    };

    const drawBall = () => {
        ctx.beginPath();
        ctx.fillStyle = '#fbbf24';
        ctx.shadowBlur = 22;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    };

    const clampPaddle = (paddle) => {
        if (paddle.y < 0) {
            paddle.y = 0;
        } else if (paddle.y + paddle.height > canvas.height) {
            paddle.y = canvas.height - paddle.height;
        }
    };

    const updatePaddlePosition = (paddle, isBallMovingTowards) => {
        const targetY = isBallMovingTowards
            ? ball.y - paddle.height / 2
            : (canvas.height - paddle.height) / 2;

        const adjustmentSpeed = paddle.speed * (isBallMovingTowards ? 1 : 0.35);
        if (Math.abs(targetY - paddle.y) > adjustmentSpeed) {
            paddle.y += Math.sign(targetY - paddle.y) * adjustmentSpeed;
        } else {
            paddle.y = targetY;
        }

        clampPaddle(paddle);
    };

    const handlePaddleCollision = (paddle, direction) => {
        const paddleCenter = paddle.y + paddle.height / 2;
        const distanceFromCenter = ball.y - paddleCenter;
        const normalized = distanceFromCenter / (paddle.height / 2);
        const clampedNormalized = Math.max(-1, Math.min(1, normalized));

        const maxBounceAngle = (Math.PI / 4);
        const bounceAngle = clampedNormalized * maxBounceAngle;

        ball.speed = Math.min(ball.speed + 0.25, ball.maxSpeed);
        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle);
        ball.velocityY = ball.speed * Math.sin(bounceAngle);
        ball.x = direction < 0
            ? paddle.x - ball.radius
            : paddle.x + paddle.width + ball.radius;
    };

    const updateBall = () => {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
            ball.velocityY *= -1;
            ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
        }

        if (
            ball.velocityX < 0 &&
            ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
            ball.y >= leftPaddle.y &&
            ball.y <= leftPaddle.y + leftPaddle.height
        ) {
            handlePaddleCollision(leftPaddle, 1);
        }

        if (
            ball.velocityX > 0 &&
            ball.x + ball.radius >= rightPaddle.x &&
            ball.y >= rightPaddle.y &&
            ball.y <= rightPaddle.y + rightPaddle.height
        ) {
            handlePaddleCollision(rightPaddle, -1);
        }

        if (ball.x + ball.radius < 0) {
            resetBall(1);
        } else if (ball.x - ball.radius > canvas.width) {
            resetBall(-1);
        }
    };

    const draw = () => {
        drawBackground();
        drawPaddle(leftPaddle);
        drawPaddle(rightPaddle);
        drawBall();
    };

    const update = () => {
        updatePaddlePosition(leftPaddle, ball.velocityX < 0);
        updatePaddlePosition(rightPaddle, ball.velocityX > 0);
        updateBall();
        draw();
        requestAnimationFrame(update);
    };

    update();
}

function updateCurrentYear() {
    const currentYearSpan = document.getElementById('current-year');
    if (!currentYearSpan) {
        return;
    }

    const currentYear = new Date().getFullYear();
    currentYearSpan.textContent = String(currentYear);
}
