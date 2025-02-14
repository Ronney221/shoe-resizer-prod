# Shoe Resizer Prod

[Live Demo](https://shoe-resizer-prod.vercel.app/)

## Overview

**Shoe Resizer Prod** is a production-ready tool built for a friend's shoe store that normalizes and formats shoe images for a consistent and professional look. By leveraging computer vision techniques with Python libraries, the application automatically crops, scales, and pads images to ensure that all product pictures are uniform and visually appealing.

## Key Features

- **Automatic Cropping:** Detects the shoe by identifying non-white pixels and crops out excess background.
- **Dynamic Scaling:** Resizes images to a target width while preserving the original aspect ratio.
- **Uniform Padding:** Adds consistent white padding to standardize image dimensions.
- **Production-Ready API:** Built as a microservice with dedicated endpoints for image processing.

## Technologies & Tools

- **Backend:** Python with [Flask](https://flask.palletsprojects.com/)
- **Image Processing:** [Pillow](https://python-pillow.org/) and [NumPy](https://numpy.org/)
- **CORS Handling:** [Flask-Cors](https://flask-cors.readthedocs.io/)
- **Deployment:** Configured for deployment on [Vercel](https://vercel.com/)
- **Production Server:** [Gunicorn](https://gunicorn.org/) for WSGI compatibility

## Design & Architecture

The application is structured as a microservice with a clear, modular design:

- **Endpoints:**
  - **`/crop` Endpoint:** A debugging endpoint that demonstrates the image cropping functionality.
  - **`/process` Endpoint:** The main processing pipeline which:
    - **Crops** the image to focus on the shoe.
    - **Scales** the cropped image to a target width (e.g., 1698 pixels).
    - **Pads** the scaled image uniformly to meet specific dimension requirements.
- **Modular Functions:** The code is organized into distinct functions for cropping, scaling, and padding, ensuring maintainability and easy extensibility.

## Deployment

This project is configured with a `vercel.json` file for seamless deployment on Vercel. The configuration splits the backend Python service from any static assets, optimizing performance and scalability.

## Contact

For questions, feedback, or collaboration opportunities, please get in touch:

- **Email:** [ronney@cs.washington.edu](mailto:ronney@cs.washington.edu)

---

Shoe Resizer Prod is a testament to clean design and efficient image processing. It’s an ideal solution for anyone looking to achieve a polished and consistent look for product images.

 ![Alt Text](https://github.com/user-attachments/assets/4e4616e5-5f53-4bf5-baf8-041bb628702c)
 ![Alt Text](https://github.com/user-attachments/assets/2ff77ba8-74d6-46be-a896-05266ebdbaa3)
 ![Alt Text](https://github.com/user-attachments/assets/088e018e-66b1-40d1-8cde-4cb26700c592)
 ![Alt Text](https://github.com/user-attachments/assets/08b1ff74-5137-4cd4-8639-c68643b785c8)
