<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kiwicom/Paper-Plane">
    <img src="public/PaperPlaneLogo640x464.png" alt="Logo" width="320" height="232">
  </a>

<h1 align="center">Paper Plane</h1>

  <p align="center">
    OpenAPI based mock management system.
    <br />
    <a>View Demo</a>
    ·
    <a href="https://github.com/kiwicom/Paper-Plane/issues">Report Bug</a>
    ·
    <a href="https://github.com/kiwicom/Paper-Plane/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## ✈️ About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Paper Plane is a web application for creating and managing mocks of production web app. The whole application in based
on Firebase platform. Paper Plane takes advantage of OpenAPI standard and uses it for generation and validation
of mocked API responses. 

![Paper Plane Architecture drawio](https://user-images.githubusercontent.com/26377907/166120232-b213e39b-b9f1-4ec8-9ed5-adb8116c4068.png)

Paper Plane helps you manage mocks for your production website and is compatible with API based on OpenAPI v2, v3 and v3.1 specification.


### Built With

- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Orbit](https://orbit.kiwi/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker)
- [react-hook-form](https://react-hook-form.com/)
- [React Query](https://react-query.tanstack.com/)

<!-- GETTING STARTED -->

### Prerequisites

* Firebase Project with Firestore DB and Google Cloud Functions*

_*only required for deployment_

## 🧩 Running Paper Plane Locally

1. **Setup Firebase ENV variables** - create `.env.local` based on `.env.local.example`
2. **Enable Google Sign-in method** in your Firebase Project
3. `yarn install`
4. `yarn dev`

## 🚀 Deployment

`main` branch is automatically deployed to Kiwi.com's Paper Plane Firebase project, through GitHub Actions.

### Hosting custom Paper Plane instance

1. Fork [Paper Plane Repository](https://github.com/kiwicom/Paper-Plane)
2. [Run Paper Plane Locally](#running-paper-plane-locally)
3. (Manual deployment)
    * `firebase login`
    * `firebase use <project_id|alias>`
    * `yarn deploy`
4. (Continuous deployment through GitHub Actions)
   - Move environment variables from `.env.local` to your [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
   - Enable GitHub Actions in your repository

   - ⚠️ Service Account stored in GitHub secret `FIREBASE_SERVICE_ACCOUNT_PAPER_PLANE` will require following GCP IAM roles
        * **Cloud Functions Developer** - Cloud Functions deployment
        * **Firebase Authentication Admin** - Full read/write access to Firebase Authentication resources
        * **Firebase Hosting Admin** - Client hosting deployment
        * **API Keys Viewer** - Getting API keys for a project
   - ⚠️ Make sure `firebase-adminsdk` has the rights to access Firestore, if not set following GCP IAM roles
   to service account used for running Cloud Function (usually `<project_id>@appspot.gserviceaccount.com`)
        * **Cloud Functions Admin** - Full access to functions, operations and locations.
        * **Editor** - View, create, update, and delete most Google Cloud resources. See the list of included permissions.
        * **Firestore Service Agent** - Gives Firestore service account access to managed resources.




<!-- ROADMAP -->

## 🚧 Roadmap

- [x] OpenAPI's validation during mock editing and mock creation process
- [ ] Validating mocks against OpenAPI schema periodically or on each api request and updating mock validity status in Firestore
- [ ] Automatic repair of invalid mocks
- [ ] Creating non-OpenAPI API mocks
- [ ] Configurable project access roles in project settings
- [ ] Integration tests
- [ ] Configurable default Client URL base options in project config
- [ ] Diff for mocks
- [ ] Creating mocks through templates of existing mocks
- [ ] Contribution guide

<!-- LICENSE -->

## 🪪 License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/kiwicom/Paper-Plane.svg?style=for-the-badge
[contributors-url]: https://github.com/kiwicom/Paper-Plane/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kiwicom/Paper-Plane.svg?style=for-the-badge
[forks-url]: https://github.com/kiwicom/Paper-Plane/network/members
[stars-shield]: https://img.shields.io/github/stars/kiwicom/Paper-Plane.svg?style=for-the-badge
[stars-url]: https://github.com/kiwicom/Paper-Plane/stargazers
[issues-shield]: https://img.shields.io/github/issues/kiwicom/Paper-Plane.svg?style=for-the-badge
[issues-url]: https://github.com/kiwicom/Paper-Plane/issues
[license-shield]: https://img.shields.io/github/license/kiwicom/Paper-Plane.svg?style=for-the-badge
[license-url]: https://github.com/kiwicom/Paper-Plane/blob/master/LICENSE.txt
[product-screenshot]: https://user-images.githubusercontent.com/26377907/163712872-0764607d-398c-405f-b62e-0445d099153d.png
