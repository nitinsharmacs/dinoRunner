(function () {
  const random = (lowerLimit, upperLimit) => {
    return lowerLimit + Math.random() * (upperLimit - lowerLimit)
  };

  const px = (value) => {
    return value + 'px';
  };

  const removeElement = (elementId) => {
    const element = document.getElementById(elementId);
    element && element.remove();
  };

  const createImg = (src) => {
    const imgElement = document.createElement('img');
    imgElement.src = src;
    return imgElement;
  };

  class Cloud {
    constructor(id, x, y, opacity, speed, src) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.src = src;
      this.opacity = opacity;
    }

    move() {
      this.x -= this.speed;
      if (this.x < -300) {
        this.x = window.innerWidth;
      }
    }
  }

  const renderCloud = (cloud, viewElement) => {
    const { id, src, x, y, opacity } = cloud;

    removeElement(id);

    const cloudHtml = document.createElement('div');
    cloudHtml.classList.add('cloud');
    cloudHtml.id = id;
    cloudHtml.style.top = y;
    cloudHtml.style.left = x;
    cloudHtml.style.opacity = opacity;

    const imgElement = createImg(src);

    cloudHtml.appendChild(imgElement);
    viewElement.appendChild(cloudHtml);
  };

  const renderClouds = (clouds, viewElement) => {
    clouds.forEach(cloud => {
      renderCloud(cloud, viewElement);
    });
  };

  const createCloud = (cloudId) => {
    const cloud = new Cloud(
      cloudId,
      random(1, window.innerWidth),
      random(10, 300),
      random(0.5, 1),
      random(5, 10),
      'assests/clouds.png'
    );

    return cloud;
  };

  const createClouds = (cloudCounts) => {
    const clouds = [];

    for (let index = 0; index < cloudCounts; index++) {
      clouds.push(createCloud(`cloud-${index}`));
    }

    return clouds;
  };

  const moveClouds = (clouds) => {
    clouds.forEach(cloud => cloud.move());
  };

  const renderCactus = ({ id, x, y, img, width, height }, parent) => {
    removeElement(id);

    const CactusElement = document.createElement('div');
    CactusElement.id = id;
    CactusElement.classList.add('cactus');
    CactusElement.style.width = px(width);
    CactusElement.style.height = px(height);
    CactusElement.style.left = px(x);
    CactusElement.style.top = px(y);

    const cactusImage = createImg(img);

    CactusElement.appendChild(cactusImage);
    parent.appendChild(CactusElement);
  };

  class Dinosaur {
    constructor(id, x, y, width, height) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.img = 'assests/runningDino.gif';
    }

    jump(onJumpEnd) {
      const oldY = this.y;
      const oldImg = this.img;

      this.y = -120;
      this.img = 'assests/dinoStopped.png';

      setTimeout(() => {
        this.y = oldY;
        this.img = oldImg;

        onJumpEnd();
      }, 1000);
    }

    hasHitWith(obstacle) {
      const dinoRight = this.x + this.width;
      const obstacleRight = obstacle.x + obstacle.width;
      const dinoBottom = this.y + this.height;

      return (
        (dinoRight) >= (obstacle.x) &&
        (this.x) <= (obstacleRight) &&
        (dinoBottom) > (obstacle.y)
      );
    }

    stop() {
      this.img = 'assests/dinoStopped.png';
    }
  }

  const createDinosaur = () => {
    return new Dinosaur(
      'dino',
      100,
      50,
      200,
      150
    );
  };

  const renderDinosaur = ({ id, x, y, width, height, img }, viewElement) => {
    removeElement(id);

    const dinosaurHtml = document.createElement('div');
    dinosaurHtml.classList.add('dinosaur');
    dinosaurHtml.style.width = px(width);
    dinosaurHtml.style.height = px(height);
    dinosaurHtml.style.left = px(x);
    dinosaurHtml.style.top = px(y);
    dinosaurHtml.id = id;

    const dinoImage = createImg(img);

    dinosaurHtml.appendChild(dinoImage);
    viewElement.appendChild(dinosaurHtml);
  };

  class Cactus {
    constructor(id, x, y, width, height, speed) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.img = 'https://cdn.pixabay.com/photo/2020/07/06/07/35/cactus-5375863_960_720.png';
    }

    move() {
      this.x -= this.speed;
      if (this.x < -300) {
        this.x = window.innerWidth;
      }
    }
  }

  const createObstacle = () => {
    const obstacleId = 'cactus';
    const cactus = new Cactus(
      obstacleId,
      window.innerWidth,
      50,
      100,
      150,
      10
    );
    return cactus;
  };

  const main = () => {
    const road = document.getElementById('road');
    const cloudsElement = document.getElementById('clouds');

    const clouds = createClouds(10);
    renderClouds(clouds, cloudsElement);

    const obstacle = createObstacle();
    renderCactus(obstacle, road);

    const dinosaur = createDinosaur();
    renderDinosaur(dinosaur, road);

    const intervalId = setInterval(() => {
      if (dinosaur.hasHitWith(obstacle)) {
        clearInterval(intervalId);

        dinosaur.stop();
        renderDinosaur(dinosaur, road);
        return;
      }

      moveClouds(clouds);
      renderClouds(clouds, cloudsElement);

      obstacle.move();
      renderCactus(obstacle, road);
    }, 30);

    window.onkeydown = (event) => {
      if (event.code !== 'Space') {
        return;
      }
      dinosaur.jump(() => {
        renderDinosaur(dinosaur, road);
      });

      renderDinosaur(dinosaur, road);
    };
  };

  window.onload = main;
})();