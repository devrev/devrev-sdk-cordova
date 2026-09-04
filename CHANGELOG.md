# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.1] - 2026-06-03

### Fixed
- Fixed session recordings associating events with the wrong DevRev workspace.
- [iOS] Fixed crashes from thread-unsafe access.
- [Android] Fixed masking issues on rapid scrolls.
- [Android] Fixed an issue with missing crash types.

## [2.3.0] - 2026-04-28

### Changed
- Reduced snapshot size and screen capture cost.
- Optimized masking performance for dynamic webviews.

### Fixed
- Fixed multiple memory leaks and reduced CPU usage during paused recording.
- Fixed crashes and ANRs related to session recording lifecycle.
- Improved web view masking stability.
- Fixed incorrect session engagement time calculation.

## [2.2.1] - 2026-01-29

### Changed
- Lowered the minimum supported Dart SDK to `3.5.0` across the plugin to match current Flutter stable toolchains.
- Improved session replays stabality and performance.
- Reduced log noise.
- [Android] Removed redundant dependencies for reduced SDK size and enhanced security.

### Fixed
- Fixed session data not found.

## [2.2.0] - 2025-12-23

### Added
- [Android] Support for session capturing on Android 16 devices.
- Support for tracking hybrid platforms and their versions.
- [iOS] Added automatic restoration of sessions lost when the app is killed.
- Introduced a capture error API so apps can report runtime errors through the SDK.

### Changed
- Improved rage tap detection to avoid misclassifying double taps as rage taps.
- Improved performance and modularity by decoupling the screen recording functionality from the main tracking flow.
- [Android] Optimized session recording and network request handling to reduce overhead during active sessions.

### Fixed
- Fixed an issue in the logout flow.
- [iOS] Corrected timer response rounding to return accurate durations.
- [Android] Fixed incorrect engagement time calculation in crash scenarios.
- [Android] Fixed ANRs occurring during SDK initialization.

## [2.1.1] - 2025-07-25

### Fixed
- Fixed an issue with manual unmasking of input components.
- Fixed an issue with session uploads when the app is rapidly killed.

## [2.1.0] - 2025-06-27

### Added
- iOS only: Introduced crash reporting integrated with session recordings.

### Changed
- Improved the support widget navigaion.

### Fixed
- Fixed an issue with timer tracking to ensure correct session properties are recorded.

## [2.0.0] - 2025-06-12

### Changed
- Improved the communication with the DevRev backend.
- Improved the encryption techniques used throughout the SDK.

### Removed
- The `getSessionURL` function has been removed.

## [1.0.0] - 2025-05-20

### Added
- Introduced the Session Analytics feature. This feature allows you to monitor the health of your application and its components.
- Added support for Push Notifications for the PLuG support chat.
- Added support to create new conversations in the PLuG support chat.
