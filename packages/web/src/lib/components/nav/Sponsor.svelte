<script lang="ts">
    // import Fa from "svelte-fa";

    // Ensure animations work properly
    // function cycleFeatures(container: HTMLElement) {
    //     const features = container.querySelectorAll(".feature") as NodeListOf<HTMLElement>;

    //     // Initialize - hide all features except the first one
    //     features.forEach((feature, index) => {
    //         if (index === 0) {
    //             feature.classList.add("active");
    //         } else {
    //             feature.style.transform = "translateX(100%)";
    //             feature.style.opacity = "0";
    //         }
    //     });

    //     let currentIndex = 0;

    //     // Set interval to cycle through features
    //     setInterval(() => {
    //         // Calculate next index
    //         const nextIndex = (currentIndex + 1) % features.length;

    //         // Exit current feature to the left
    //         features[currentIndex].classList.remove("active");
    //         features[currentIndex].classList.add("exit");

    //         // Show next feature
    //         setTimeout(() => {
    //             features[nextIndex].style.transform = "";
    //             features[nextIndex].style.opacity = "";
    //             features[nextIndex].classList.add("active");
    //         }, 50);

    //         // Reset the exited feature after animation completes
    //         setTimeout(() => {
    //             features[currentIndex].classList.remove("exit");
    //             features[currentIndex].style.transform = "translateX(100%)";
    //             features[currentIndex].style.opacity = "0";
    //             currentIndex = nextIndex;
    //         }, 700);
    //     }, 8000);
    // }
</script>

<div class="container">
    <p>Sponsored by</p>
    <!-- Dark Mode -->
    <a class="dark render-dark" href="https://www.offsetrobotics.com/" target="_blank">
        <img src="/img/offsetlogo_dark.png" alt="Offset Robotics Logo" />
    </a>

    <!-- Light Mode -->
    <a class="light render-light" href="https://www.offsetrobotics.com/" target="_blank">
        <img src="/img/offsetlogo_light.png" alt="Offset Robotics Logo" />
    </a>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        text-align: center;
    }

    .container > p {
        font-size: var(--md-font-size);
        margin: 0;
        width: 100%;
        text-align: center;
    }

    .container > a > img {
        width: 100%;
        max-width: 720px;
    }

    a:hover {
        text-decoration: none;
    }

    .dark {
        color: white;
    }

    .light {
        color: #1c1c1e;
    }
</style>
