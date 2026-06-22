import type { BlogPost } from '../components/BlogCard';

export const blogPosts: BlogPost[] = [
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
