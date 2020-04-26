var damp = 0.9;
var padding = 5;
var minVel = 0.8;
var timestep = 1;
var particles = [];
var gravityAdjuster = {x:map(0.05, 0.01, 0.1, 50, 200), y:70};
var collisionAdjuster = map(0.6, 0.5, 0.9, 50, 200);
var acceleration = 0.05;
var collisionDamp = 0.6;
var color = {r:0, g:0, b:0, rx:50, gx:50, bx:50};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight + 10;
function execution_loop(){
  //canvas.width  = window.innerWidth;
  //canvas.height = window.innerHeight;
  setTimeout(execution_loop,1000/150);
  background(255, 255, 255);
  //gravityAdjuster
  stroke(0,0,0);
  strokeWeight(2);
  textSize(20);
  fill(0,0,0);
  text("Gravity", 50, 30);
  style(0,0,0);
  line(50, 70, 250, 70);
  fill(255, 255, 255);
  ellipse(gravityAdjuster.x, gravityAdjuster.y, 20, 20);
  if (mouseIsPressed && abs(mouseY - 70) < 20 && mouseX >= 50 && mouseX <= 250){
    gravityAdjuster.x = max(50, min(mouseX, 250));
    acceleration = map(gravityAdjuster.x, 50, 250, 0.01, 0.15)
  }
  //colorAdjuster
  strokeWeight(2);
  textSize(20);
  fill(0,0,0);
  text("Color", 50, 100);
  //r
  style(0,0,0);
  line(50, 130, 250, 130);
  fill(255, 255, 255);
  ellipse(color.rx, 130, 20, 20);
  if (mouseIsPressed && abs(mouseY - 130) < 20 && mouseX >= 50 && mouseX <= 250){
    color.rx = max(50, min(mouseX, 250));
    color.r = map(color.rx, 50, 250, 0, 255)
  }
  //g
  line(50, 170, 250, 170);
  fill(255, 255, 255);
  ellipse(color.gx, 170, 20, 20);
  if (mouseIsPressed && abs(mouseY - 170) < 20 && mouseX >= 50 && mouseX <= 250){
    color.gx = max(50, min(mouseX, 250));
    color.g = map(color.gx, 50, 250, 0, 255)
  }
  //b
  line(50, 210, 250, 210);
  fill(255, 255, 255);
  ellipse(color.bx, 210, 20, 20);
  if (mouseIsPressed && abs(mouseY - 210) < 20 && mouseX >= 50 && mouseX <= 250){
    color.bx = max(50, min(mouseX, 250));
    color.b = map(color.bx, 50, 250, 0, 255)
  }
  //collision damper
  strokeWeight(2);
  textSize(20);
  fill(0,0,0);
  text("Collision Force", 50, 250);
  line(50, 280, 250, 280);
  fill(255, 255, 255);
  ellipse(collisionAdjuster, 280, 20, 20);
  if (mouseIsPressed && abs(mouseY - 280) < 20 && mouseX >= 50 && mouseX <= 250){
    collisionAdjuster = max(50, min(mouseX, 250));
    collisionDamp = map(collisionAdjuster, 50, 250, 0.5, 0.9)
  }
  for (let x = 0; x < particles.length; x++){

    particles[x].x += particles[x].velX;
    particles[x].y += particles[x].velY;
    /*time += timestep;
    position += timestep * (velocity + timestep * acceleration / 2);
    velocity += timestep * acceleration;*/

    //gravity
    //collisions
    var collided = false;
    for (let y = particles.length - 1; y >= 0; y--){
      if (x != y){
          if (dist(particles[x].x, particles[x].y, particles[y].x, particles[y].y) < 30){
            //collision
            if (particles[x].velY == 0 && particles[y].velY == 0 && particles[x].velX * particles[y].velX < 0){
              particles[x].velX = -0.8 * abs(particles[x].velX);
            }
            else{
            collided = true;
            let angle = 0;
            angle = Math.atan((particles[y].y - particles[x].y)/(particles[x].x - particles[y].x)) * 180/Math.PI;
            if (particles[x].y < particles[y].y){
              if (angle > 0){
                let percent = map(angle, 0, 90, 0, 1);
                let totalVel = (Math.abs(particles[x].velX - particles[y].velX) + Math.abs(particles[x].velY - particles[y].velY)) * collisionDamp;
                particles[x].velY = percent * -totalVel;
                particles[x].velX = totalVel - abs(particles[x].velY);
              }
              else{
                angle = -1 * angle;
                let percent = map(angle, 0, 90, 0, 1);
                let totalVel = (Math.abs(particles[y].velX - particles[y].velX) + Math.abs(particles[x].velY - particles[y].velY)) * collisionDamp;
                particles[x].velY = percent * -totalVel;
                particles[x].velX = -1 * (totalVel - abs(particles[x].velY));
              }
            }
            else{
              if (angle > 0){
                let percent = map(angle, 0, 90, 0, 1);
                let totalVel = (Math.abs(particles[y].velX - particles[y].velX) + Math.abs(particles[x].velY - particles[y].velY)) * collisionDamp;
                particles[x].velY = percent * totalVel;
                particles[x].velX = -1 * (totalVel - abs(particles[x].velY));
              }
              else{
                angle = -1 * angle;
                let percent = map(angle, 0, 90, 0, 1);
                let totalVel = (Math.abs(particles[x].velX - particles[y].velX) + Math.abs(particles[x].velY - particles[y].velY)) * collisionDamp;
                particles[x].velY = percent * totalVel;
                particles[x].velX = totalVel - abs(particles[x].velY);
              }
            }
          }
        }
      }
    }
    if (!collided){
      //gravity
      if (particles[x].y > canvas.height){
        particles[x].velY = -1 * Math.abs(particles[x].velY) * damp;
      }
      if (particles[x].y > canvas.height - padding && Math.abs(particles[x].velY) < minVel){
        particles[x].velY = 0;
      }
      else{
        particles[x].y += timestep * (particles[x].velY + timestep * acceleration/2);
        particles[x].velY += timestep * acceleration;
      }
    }
    noStroke();
    fill(color.r,color.g,color.b);
    ellipse(particles[x].x, particles[x].y, 20, 20);
    particles[x].time++;
    if (particles[x].x < -20 || particles[x].x > canvas.width + 20){
      particles.splice(x, 1);
    }
    if (particles[x].time > 500 && particles[x].y > canvas.height - 30){
      particles.splice(x, 1);
    }
  }

}

execution_loop();
function mouseClicked(){
  let fine = true;
  if (dist(mouseX, mouseY, gravityAdjuster.x, gravityAdjuster.y) < 30 || dist(mouseX, mouseY, color.rx, 130) < 30 || dist(mouseX, mouseY, color.gx, 170) < 30 || dist(mouseX, mouseY, color.gx, 210) < 30){
    fine = false;
  }
  for (var x = 0; x < particles.length; x++){
    if (dist(mouseX, mouseY, particles[x].x, particles[x].y) < 30){
      fine = false;
    }
  }
  if (fine){
    particles.push({x:mouseX, y:mouseY, velX: 0, velY:0, time:0});
  }
}
