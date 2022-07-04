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

  const renderTreeTrunk = ({ id, x, img }, parent) => {
    removeElement(id);

    const treeTrunkElement = document.createElement('div');
    treeTrunkElement.id = id;
    treeTrunkElement.classList.add('tree-trunk');
    treeTrunkElement.style.left = px(x);

    const trunkImage = createImg(img);

    treeTrunkElement.appendChild(trunkImage);
    parent.appendChild(treeTrunkElement);
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

    jump(onEnd) {
      const oldY = this.y;
      this.y = -100;

      setTimeout(() => {
        this.y = oldY;

        onEnd();
      }, 1500);
    }

    hasHitWith(obstacle) {

      return (
        obstacle.x - obstacleWidth <= dinoPosition.x
        && this.y < obstacleHeight
      );
    }

    stop() {
      this.img = 'assests/dinoStopped.png';
      const [dinoImgHtml] = this.html.children;
      dinoImgHtml.src = this.img;
    }
  }

  const createDinosaur = () => {
    return new Dinosaur(
      'dino',
      100,
      50,
      100,
      200
    );
  };

  const renderDinosaur = ({ id, x, y, img }, viewElement) => {
    removeElement(id);

    const dinosaurHtml = document.createElement('div');
    dinosaurHtml.classList.add('dinosaur');
    dinosaurHtml.style.left = px(x);
    dinosaurHtml.style.top = px(y);
    dinosaurHtml.id = id;

    const dinoImage = createImg(img);

    dinosaurHtml.appendChild(dinoImage);
    viewElement.appendChild(dinosaurHtml);
  };

  class TreeTrunk {
    constructor(id, x, y, width, height, speed) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.img = 'assests/trunk.png';
    }

    move() {
      this.x -= this.speed;
      if (this.x < -300) {
        this.x = window.innerWidth;
      }
    }
  }

  const createObstacle = () => {
    const obstacleId = 'tree-trunk';
    const trunk = new TreeTrunk(
      obstacleId,
      window.innerWidth,
      12,
      100,
      200,
      10
    );
    return trunk;
  };

  const main = () => {
    const road = document.getElementById('road');
    const cloudsElement = document.getElementById('clouds');

    const clouds = createClouds(10);
    renderClouds(clouds, cloudsElement);

    const obstacle = createObstacle();
    renderTreeTrunk(obstacle, road);

    const dinosaur = createDinosaur();
    renderDinosaur(dinosaur, road);

    setInterval(() => {
      moveClouds(clouds);
      renderClouds(clouds, cloudsElement);

      obstacle.move();
      renderTreeTrunk(obstacle, road);
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