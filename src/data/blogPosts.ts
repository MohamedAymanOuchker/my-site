import type { BlogPost } from '../components/BlogCard';

export const blogPosts: BlogPost[] = [
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
