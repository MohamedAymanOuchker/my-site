import type { BlogPost } from '../components/BlogCard';

export const blogPosts: BlogPost[] = [
  {
    id: 'sim-to-real-transfer',
    title: 'Crossing the Reality Gap: Sim-to-Real Transfer',
    excerpt: 'Your policy is flawless in simulation, then faceplants on the real robot in three seconds. Here is why the reality gap exists and the techniques that make it small enough to cross.',
    date: 'JUN 23, 2026',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200',
    tags: ['Robotics', 'Reinforcement Learning', 'Simulation'],
    content: `
Your policy is flawless in simulation. It grasps every object, walks every gait, never falls. Then you load it onto the real robot and it faceplants in the first three seconds. Welcome to the reality gap, the single biggest reason reinforcement learning struggles to leave the lab.

Sim-to-real transfer is the set of techniques for training in a simulator and having the result survive contact with the physical world. None of them make the gap disappear. The good ones just make it small enough to cross.

## Why the Reality Gap Exists

A simulator is a simplified model of physics, and the robot lives in the unsimplified version. Friction is never quite what the model says, motors have backlash and delay, sensors add noise, and mass shifts the moment you bolt on a new battery. The policy overfits to the simulator's quirks, learning a solution that only works in that specific made-up world.

The deeper problem is that a learned policy will exploit anything. If the contact model is slightly wrong, the policy finds that error and leans on it, because it was rewarded for doing exactly that.

> **The core trap:** a policy optimizes for the world it trained in. If that world is even slightly fictional, the policy learns the fiction.

## Domain Randomization: Train on Chaos

The most reliable fix is to stop training in one world and start training in thousands. Domain randomization scrambles the simulator's parameters every episode: friction, mass, motor strength, sensor noise, latency, lighting. The policy never sees the same physics twice, so it cannot overfit to any single version.

The bet is simple. If the policy works across a wide enough range of randomized worlds, the real world is just one more sample inside that range. You are not modeling reality accurately. You are making the policy robust to not knowing it.

\`\`\`python
# Randomize physics every reset so the policy never overfits one world.
def randomize(env):
    env.friction     = uniform(0.6, 1.4)   # ground grip varies
    env.motor_gain   = uniform(0.8, 1.2)   # actuator strength
    env.payload_kg   = uniform(0.0, 2.0)   # unknown attachments
    env.sensor_noise = uniform(0.0, 0.05)  # IMU / encoder jitter
    env.action_delay = randint(0, 3)       # control latency, steps
    return env
\`\`\`

Pick the ranges too narrow and the policy stays brittle. Too wide and it learns nothing, hedging so hard it ends up mediocre everywhere. Finding that band is most of the work.

## What Actually Breaks on Hardware

The gap rarely opens where the math says it should. The surprises are mechanical and mundane.

1. **Latency.** The simulator applies actions instantly. The real control loop has delay between deciding and moving, and a policy trained without it oscillates the moment it meets a real motor.
2. **The dynamics you didn't model.** Cable drag, a wheel that is slightly out of round, a gearbox that sticks when cold. None are in the sim, all are in the robot.
3. **Sensor reality.** Sim sensors are clean. Real ones drop frames, saturate in sunlight, and disagree with each other, exactly the conditions a good sensor-fusion layer exists to smooth over.

> **Hard-won lesson:** model the actuator and the latency before you touch the visuals. Cheap dynamics errors break more policies than imperfect rendering ever will.

## Closing the Loop with Real Data

Randomization gets you close; real data gets you the rest of the way. The strongest pipelines run a feedback loop: deploy the policy on hardware, record where it disagrees with the simulator, then tune the sim's parameters until the two match. Each pass shrinks the gap.

This is where a little real-world rollout data is worth an enormous amount of simulation. You stop guessing the friction range and start measuring it, then center your randomization on the truth instead of a hopeful guess.

## Conclusion

Sim-to-real is less a trick than a discipline of humility. You assume your simulator is wrong, train a policy that does not care exactly how, and then use real measurements to close whatever gap is left. The teams that ship learned policies are not the ones with the prettiest simulators. They are the ones who respected the gap early, randomized hard, and let the robot tell them where the model lied.
    `,
  },
  {
    id: 'slam-from-scratch',
    title: 'SLAM From Scratch: Mapping an Unknown World',
    excerpt: 'Drop a robot into a room it has never seen and it has to draw the map and find itself on that map at the same time. Here is how SLAM pulls off the trick, and why the map still drifts.',
    date: 'JUN 23, 2026',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200',
    tags: ['Robotics', 'SLAM', 'Localization'],
    content: `
Drop a robot into a building it has never seen and ask it to make a map. It cannot, because to place a wall on the map it needs to know where it is standing, and to know where it is standing it needs a map to compare against. That circular dependency is the whole problem. Simultaneous Localization and Mapping, or SLAM, is the family of algorithms that breaks the circle by solving both halves at once.

I have watched a lot of beautifully rendered maps slowly bend themselves into nonsense, so this is as much about the failure modes as the theory.

## The Chicken-and-Egg Problem

SLAM is hard because localization and mapping each depend on the other. You cannot build an accurate map without knowing your pose, and you cannot estimate your pose accurately without a map. SLAM sidesteps the deadlock by treating both as a single estimation problem and refining them together as new sensor data arrives.

The trick is to never commit too hard to either one. The robot keeps a running estimate of its trajectory and the map, and every new scan is a chance to nudge both toward consistency.

> **The core bet:** small errors are tolerable as long as they stay correlated. SLAM does not need a perfect pose at every step. It needs the accumulated error to be correctable later.

## Scan Matching Estimates How You Moved

Between two moments, the robot needs to know how far it traveled. Wheel odometry gives a rough guess, but it drifts. Scan matching refines that guess by sliding the newest laser scan over the previous one and finding the rotation and translation that make them line up best.

Algorithms like Iterative Closest Point do this by repeatedly pairing nearby points and minimizing the distance between them. The output is a corrected motion estimate that is far better than odometry alone, especially in corridors and rooms with distinct geometry.

This is also where a good motion prior pays off. Fusing wheel odometry and an IMU first, the same way an Extended Kalman Filter does for localization, gives scan matching a much better starting guess and keeps it from locking onto the wrong alignment.

## The Occupancy Grid Is the Map

Most ground-robot SLAM represents the world as an occupancy grid: a 2D array of cells, each holding the probability that it is occupied. Rather than storing raw probabilities, you store log-odds, because then every sensor update is just an addition and the values never get stuck at exactly 0 or 1.

\`\`\`python
import numpy as np

# Log-odds occupancy grid. Positive = likely occupied, negative = likely free.
grid = np.zeros((height, width), dtype=np.float32)

L_OCC, L_FREE = 0.85, -0.4   # per-hit evidence
L_MIN, L_MAX = -5.0, 5.0     # clamp so a cell can always change its mind

def update_cell(row, col, hit):
    grid[row, col] += L_OCC if hit else L_FREE
    grid[row, col] = np.clip(grid[row, col], L_MIN, L_MAX)
\`\`\`

Clamping matters more than it looks. Without it, a cell that has been seen as a wall ten thousand times becomes so certain that a moved chair can never erase it. The clamp keeps the map able to change its mind.

## Loop Closure Fixes the Drift

Here is the part that makes or breaks a map. As the robot drives, small scan-matching errors accumulate, and a long loop around a building comes back not quite meeting itself. Loop closure is the moment the robot recognizes a place it has visited before and snaps the whole trajectory back into alignment.

Detecting that revisit is the hard half. Get it right and a drifted map folds cleanly shut. Get it wrong, matching two different rooms that happen to look alike, and the optimizer confidently tears the map in two.

> **Hard-won lesson:** a single false loop closure does more damage than a thousand small odometry errors. Be conservative about declaring a revisit.

## What Breaks in the Real World

The textbook version assumes a tidy, static world. The building does not cooperate.

1. **Long featureless hallways.** Scan matching needs geometry to bite into. In a straight corridor with no doorways, every scan looks the same and the robot slides blindly, accumulating error it cannot detect.
2. **Moving people.** A person walking past gets baked into the map as a smear of phantom walls unless you actively reject dynamic points.
3. **Symmetry.** Two identical rooms are a loop-closure trap. The detector sees a perfect match and closes a loop that should never have existed.

## Conclusion

SLAM is not magic, and it is not solved. It is a careful balancing act between trusting your motion estimate and trusting your sensors, held together by the occasional loop closure that pays down accumulated drift. Build it once from the grid up and you stop seeing the map as a picture and start seeing it as a hypothesis, one the robot is always quietly revising. That shift in mindset is what makes the failures predictable, and predictable failures are the ones you can engineer around.
    `,
  },
  {
    id: 'deploying-ml-on-the-edge',
    title: 'Deploying ML Models on the Edge',
    excerpt: 'Cloud inference is easy until the network drops. Here is how we shrank a detection model to run in real time on a Jetson, and what the benchmarks never warned us about.',
    date: 'JUN 22, 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200',
    tags: ['Edge AI', 'TensorRT', 'Optimization'],
    content: `
The first time our robot lost its network connection mid-row, the perception stack went blind for four seconds. The model was running in the cloud, and four seconds is a long time for a machine moving through a field full of expensive crops. That failure is the entire argument for edge inference: when the model runs on the robot, latency is bounded and a dropped connection is an inconvenience instead of an emergency.

The catch is that the hardware on the robot is nothing like the GPU you trained on. Getting a model to run there in real time is mostly a story about giving things up gracefully.

## Why Move Inference Off the Cloud

Round-tripping every camera frame to a server adds network latency you do not control, and it fails completely when connectivity does. Running inference locally collapses that round trip to a few milliseconds and keeps the robot autonomous when the link is gone.

Modern edge accelerators make this realistic. An NVIDIA Jetson Orin Nano now delivers up to 67 INT8 TOPS inside a 7 to 25 watt power envelope ([NVIDIA](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/), 2025). That is enough to run a real-time detector, but only after you stop treating the model like it is still on a datacenter card.

> **The mental shift:** on the edge, your budget is not just accuracy. It is accuracy *per watt* and accuracy *per millisecond*. Every optimization is a trade against one of those.

## Quantization Is Where the Speed Comes From

The single biggest win is quantization, dropping the model's weights and activations from 32-bit floats to 8-bit integers. As of 2025, converting a model to INT8 with NVIDIA TensorRT typically delivers a 2 to 3 times latency reduction over FP32, and quantization-aware training can claw accuracy back to within a fraction of a percent of the original model ([NVIDIA Technical Blog](https://developer.nvidia.com/blog/achieving-fp32-accuracy-for-int8-inference-using-quantization-aware-training-with-tensorrt/), 2025).

The reason it works is hardware: INT8 operations run on dedicated tensor cores that are faster and cheaper than their floating-point counterparts. The reason it is tricky is calibration. The compiler needs to see representative data to choose the right scaling factors, so you feed it a sample of real inputs, not random noise.

\`\`\`python
import torch
import torch_tensorrt

# Calibrate on a representative sample of REAL field images,
# not random tensors. Bad calibration data means bad accuracy.
calibrator = torch_tensorrt.ptq.DataLoaderCalibrator(
    calib_loader,
    cache_file="./calibration.cache",
    algo_type=torch_tensorrt.ptq.CalibrationAlgo.ENTROPY_CALIBRATION_2,
)

trt_model = torch_tensorrt.compile(
    model,
    inputs=[torch_tensorrt.Input((1, 3, 640, 640))],
    enabled_precisions={torch.int8},
    calibrator=calibrator,
)
\`\`\`

## Measure on the Device, Not the Datasheet

Vendor TOPS numbers describe a peak the chip reaches under ideal conditions you will never see. The only latency that matters is the one you measure on the actual board, with the actual model, running the actual preprocessing. Always warm up first, because the first few inferences pay for lazy initialization that has nothing to do with steady-state speed.

\`\`\`python
import time
import torch

def benchmark(model, sample, runs=200):
    for _ in range(20):          # Warm up the engine
        model(sample)
    torch.cuda.synchronize()

    start = time.perf_counter()
    for _ in range(runs):
        model(sample)
    torch.cuda.synchronize()
    return (time.perf_counter() - start) / runs * 1000  # ms per frame
\`\`\`

Run that on your desktop GPU and on the Jetson, and the gap between them is your real optimization target.

## What the Benchmarks Never Warned Us About

The math of quantization is well documented. The failures in the field are not.

1. **Thermal throttling.** A passively cooled board hits its TOPS rating for about ninety seconds, then the clocks drop as it heats up. Our "real-time" model was real-time only until the sun hit the enclosure. A heatsink fixed more latency than a week of model tuning.
2. **The bottleneck was the CPU.** We spent days shaving milliseconds off the network while the real cost was image resizing and color conversion happening single-threaded on the CPU. Moving preprocessing onto the GPU mattered more than any change to the model itself.
3. **Memory bandwidth, not compute.** Small models on the Orin Nano were often starved waiting for data, not maxed out on math. The accelerator sat idle because it could not be fed fast enough.

> **Hard-won lesson:** profile the whole pipeline before you optimize the model. The slowest part is rarely the part you assumed.

## Conclusion

Edge deployment is a discipline of subtraction. You quantize, you prune, you move work off the critical path, and you measure everything on the hardware that will actually run in production. The reward is a robot that keeps thinking when the network does not, and for anything operating in the real world, that resilience is worth far more than the last point of accuracy you gave up to get it.
    `,
  },
  {
    id: 'sensor-fusion-extended-kalman-filter',
    title: 'Sensor Fusion with an Extended Kalman Filter',
    excerpt: 'Why a single sensor never tells the truth, and how we fused wheel odometry with IMU data to keep our robot localized when GPS drops out.',
    date: 'JUN 22, 2026',
    image: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200',
    tags: ['Robotics', 'Sensor Fusion', 'Kalman Filter'],
    content: `
Ask a robot where it is and you will get a different answer from every sensor it owns. Wheel encoders insist the robot has driven straight, ignoring the wheel that was slipping in the mud. The IMU swears the robot is rotating, but that drift accumulates until the heading is meaningless. GPS is confident, right up until the robot rolls under a tree canopy. Sensor fusion is the art of combining these unreliable narrators into a single estimate that is better than any of them alone.

The Extended Kalman Filter (EKF) is the workhorse for this. It is not the newest tool, but it is fast, well understood, and runs comfortably on the embedded hardware we deploy in the field.

## Why a Single Sensor Always Lies

Every sensor has a failure mode, and the failure modes are conveniently different from one another.

- **Wheel odometry** is precise over short distances but drifts badly during slip. On loose soil it will tell you the robot moved a meter when it barely moved at all.
- **IMUs** give you high-frequency orientation and acceleration, but integrating acceleration to get position amplifies noise into runaway error within seconds.
- **GPS** gives you absolute position with no drift, but it is low-frequency, noisy at the centimeter scale, and disappears entirely indoors or under cover.

The insight behind fusion is that these errors are largely independent. When odometry drifts, GPS can correct it. When GPS drops out, odometry and the IMU can coast through the gap. The filter's job is to weight each source by how much it should be trusted at that instant.

## The Predict-Update Cycle

A Kalman filter runs a two-step loop. First it **predicts** where the robot should be using a motion model. Then, when a measurement arrives, it **updates** that prediction, pulling the estimate toward the sensor reading in proportion to its confidence.

> **The core idea:** the filter tracks not just the state (position, heading, velocity) but also a covariance matrix that represents how uncertain it is about that state. Prediction grows the uncertainty; measurements shrink it.

The "Extended" part exists because robots are nonlinear. A standard Kalman filter assumes everything is linear, but a differential-drive robot's heading turns velocity into x and y motion through sines and cosines. The EKF handles this by linearizing the motion model around the current estimate using a Jacobian at each step.

Here is the prediction step for a differential-drive robot, stripped down to the essentials:

\`\`\`python
import numpy as np

def predict(state, covariance, v, omega, dt, process_noise):
    x, y, theta = state

    # Nonlinear motion model
    x_new = x + v * np.cos(theta) * dt
    y_new = y + v * np.sin(theta) * dt
    theta_new = theta + omega * dt

    # Jacobian of the motion model w.r.t. the state
    F = np.array([
        [1, 0, -v * np.sin(theta) * dt],
        [0, 1,  v * np.cos(theta) * dt],
        [0, 0,  1],
    ])

    new_state = np.array([x_new, y_new, theta_new])
    new_cov = F @ covariance @ F.T + process_noise
    return new_state, new_cov
\`\`\`

The covariance grows every prediction step. That is the filter honestly admitting that dead reckoning gets less trustworthy the longer it runs without a correction.

## The Update Step

When a measurement arrives, the filter computes the **Kalman gain**, which decides how much to trust the new data versus the prediction. A noisy sensor gets a small gain and barely nudges the estimate; a precise one gets a large gain and pulls hard.

\`\`\`python
def update(state, covariance, measurement, H, measurement_noise):
    # Innovation: how far the measurement is from our prediction
    y_residual = measurement - H @ state

    # Innovation covariance
    S = H @ covariance @ H.T + measurement_noise

    # Kalman gain
    K = covariance @ H.T @ np.linalg.inv(S)

    new_state = state + K @ y_residual
    new_cov = (np.eye(len(state)) - K @ H) @ covariance
    return new_state, new_cov
\`\`\`

The beauty of this is that you can feed in measurements from different sensors at their own rates. GPS arrives at 1Hz with a large measurement noise; the IMU heading arrives at 100Hz with a small one. The same update function handles both, as long as you supply the right measurement matrix \`H\` and noise term.

## What Actually Bit Us in the Field

The math is the easy part. The hard part is tuning, and the failures are rarely where you expect.

1. **Overconfident process noise.** We initially set the process noise too low, telling the filter the motion model was nearly perfect. The estimate became rigid and ignored real GPS corrections, lagging meters behind reality. Loosening it fixed the lag instantly.
2. **Unsynchronized timestamps.** Our IMU and odometry were timestamped on arrival, not on capture. The few milliseconds of transport delay introduced a bias that looked exactly like a calibration error and cost us a full day of chasing the wrong bug.
3. **Angle wraparound.** Heading lives on a circle, so the innovation between 179 degrees and -179 degrees should be 2 degrees, not 358. Forgetting to wrap that residual made the robot occasionally spin its estimate the long way around.

> **Hard-won lesson:** before you blame the filter, verify your timestamps and your units. The EKF is usually doing exactly what you told it to.

## Conclusion

The Extended Kalman Filter will not give you a perfect answer, because there is no perfect answer to extract from imperfect sensors. What it gives you is a principled, real-time estimate that degrades gracefully when one sensor fails instead of falling off a cliff. For most ground robots that is exactly the right trade, and it is why the EKF remains the first tool we reach for before considering anything heavier.
    `,
  }
];
