/* =========================================================
   PETALS.JS - CANVAS FALLING ROSE PETALS & GLOWING STARDUST
   ========================================================= */

(function() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PETAL_COUNT = 36;
  const SPARKLE_COUNT = 24;

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 1.3 + 0.7;
      this.speedX = Math.random() * 1.4 - 0.7;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.025;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.025 + 0.01;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.colorIndex = Math.floor(Math.random() * 3);
      this.opacity = Math.random() * 0.35 + 0.65;
    }

    update() {
      this.y += this.speedY;
      this.sway += this.swaySpeed;
      this.x += Math.sin(this.sway) * 1.2 + this.speedX;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(1, Math.cos(this.flip));
      ctx.globalAlpha = this.opacity;

      let grad = ctx.createRadialGradient(0, 0, 2, 0, 0, this.size);
      if (this.colorIndex === 0) {
        grad.addColorStop(0, '#fbcfe8');
        grad.addColorStop(0.6, '#f43f5e');
        grad.addColorStop(1, '#be123c');
      } else if (this.colorIndex === 1) {
        grad.addColorStop(0, '#ffe4e6');
        grad.addColorStop(0.7, '#fb7185');
        grad.addColorStop(1, '#e11d48');
      } else {
        grad.addColorStop(0, '#fff1f2');
        grad.addColorStop(0.8, '#fda4af');
        grad.addColorStop(1, '#f43f5e');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.4, this.size * 0.9, this.size * 0.5, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.5, -this.size * 0.6, -this.size * 0.4, 0, 0);
      ctx.fill();

      // Delicate center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.quadraticCurveTo(0, this.size * 0.5, 0, this.size * 0.85);
      ctx.stroke();

      ctx.restore();
    }
  }

  class Sparkle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.pulse = Math.random() * Math.PI;
      this.pulseSpeed = Math.random() * 0.04 + 0.02;
    }

    update() {
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      if (this.y < -10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.save();
      const currentAlpha = (Math.sin(this.pulse) * 0.4 + 0.6) * this.opacity;
      ctx.globalAlpha = Math.max(0, currentAlpha);
      ctx.fillStyle = '#fef08a'; // Golden stardust
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#fbbf24';

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const petals = Array.from({ length: PETAL_COUNT }, () => new Petal());
  const sparkles = Array.from({ length: SPARKLE_COUNT }, () => new Sparkle());

  function animate() {
    ctx.clearRect(0, 0, width, height);

    sparkles.forEach(s => {
      s.update();
      s.draw();
    });

    petals.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
})();
