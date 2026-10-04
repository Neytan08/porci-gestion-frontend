# PorciGestión

Mobile application created around a real farming need: improving the tracking of breeding sows and their reproductive records until retirement.

PorciGestión is being developed for use in a real pig breeding operation, with workflows designed around how reproductive information is actually recorded and managed.

<!-- Add 2–4 representative application screenshots here once the MVP UI is ready. -->

## Overview

The application provides a mobile interface for managing breeding sows, boars until retirement, reproduction events, pregnancy results, farrowings, and weaning records.

The interface follows the reproductive lifecycle of each sow, allowing available actions and information to reflect its current state.

## Core Workflows

- Breeding sow management
- Boar management
- Reproduction records
- Pregnancy tracking
- Farrowing records
- Weaning management
- Vaccines and vaccine type v2.0

## Engineering

The application uses a feature based structure that separates domain features from shared application infrastructure.

Reusable components, hooks, types, API communication, navigation, and feature specific logic are organized independently to keep the mobile codebase maintainable as the application grows.

## Tech Stack

**TypeScript · React Native · Expo · React Navigation · Axios**

## Status

Under active development as part of the PorciGestión MVP.

The current focus is completing the main farm workflows and establishing a stable functional version before expanding the application with additional infrastructure and future features.

## Portfolio Note

This repository is public to present the engineering work behind PorciGestión. It is not intended as an installation ready distribution, so setup instructions are intentionally omitted.

## Backend

The application communicates with a dedicated TypeScript and Express REST API.

[View PorciGestión API](https://github.com/Neytan08/porci-gestion-api)
