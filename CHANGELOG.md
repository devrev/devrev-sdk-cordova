# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
