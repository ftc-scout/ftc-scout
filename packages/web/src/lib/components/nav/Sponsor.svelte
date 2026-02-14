<script lang="ts">
    // import Fa from "svelte-fa";

    // Ensure animations work properly
    function cycleFeatures(container: HTMLElement) {
        const features = container.querySelectorAll(".feature") as NodeListOf<HTMLElement>;

        // Initialize - hide all features except the first one
        features.forEach((feature, index) => {
            if (index === 0) {
                feature.classList.add("active");
            } else {
                feature.style.transform = "translateX(100%)";
                feature.style.opacity = "0";
            }
        });

        let currentIndex = 0;

        // Set interval to cycle through features
        setInterval(() => {
            // Calculate next index
            const nextIndex = (currentIndex + 1) % features.length;

            // Exit current feature to the left
            features[currentIndex].classList.remove("active");
            features[currentIndex].classList.add("exit");

            // Show next feature
            setTimeout(() => {
                features[nextIndex].style.transform = "";
                features[nextIndex].style.opacity = "";
                features[nextIndex].classList.add("active");
            }, 50);

            // Reset the exited feature after animation completes
            setTimeout(() => {
                features[currentIndex].classList.remove("exit");
                features[currentIndex].style.transform = "translateX(100%)";
                features[currentIndex].style.opacity = "0";
                currentIndex = nextIndex;
            }, 700);
        }, 8000);
    }
</script>

<div class="container">
    <!-- Dark Theme Banner -->
    <a
        class="banner dark render-dark"
        href="https://hackclub.com/first?utm_source=ftcscout&utm_content=banner&tub_program=ftcscout"
        target="_blank"
    >
        <div class="header">
            <div class="logo-container">
                <img
                    src="/img/hcb-icon-icon-dark.png"
                    alt="HCB Logo"
                    width="36"
                    height="36"
                />
            </div>
            <div class="text-container">
                <div class="powered-by">POWERED BY HCB ⚡</div>
                <div class="bank-name">Banking platform for robotics!</div>
            </div>
        </div>
        <div class="feature-container" id="dark-features" use:cycleFeatures>
            <div class="feature" data-index="0">
                <div class="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                </div>
                <div class="feature-text">Instant 501(c)(3) nonprofit status</div>
            </div>
            <div class="feature" data-index="1" style="opacity: 0;">
                <div class="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                </div>
                <div class="feature-text">Eligible to receive grants</div>
            </div>
            <div class="feature" data-index="2" style="opacity: 0;">
                <div class="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                </div>
                <div class="feature-text">Free physical debit cards</div>
            </div>
        </div>
    </a>

    <!-- Light Theme Banner -->
    <a
        class="banner light render-light"
        href="https://hackclub.com/first?utm_source=ftcscout&utm_content=banner&tub_program=ftcscout"
        target="_blank"
    >
        <div class="header">
            <div class="logo-container">
                <img
                    src="/img/hcb-icon-icon-original.png"
                    alt="Hack Club Bank Logo"
                    width="36"
                    height="36"
                />
            </div>
            <div class="text-container">
                <div class="powered-by">POWERED BY HCB ⚡</div>
                <div class="bank-name">Banking platform for robotics!</div>
            </div>
        </div>
        <div class="feature-container" id="light-features" use:cycleFeatures>
            <div class="feature" data-index="0">
                <div class="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                </div>
                <div class="feature-text">Instant 501(c)(3) nonprofit status</div>
            </div>
            <div class="feature" data-index="1" style="opacity: 0;">
                <div class="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                </div>
                <div class="feature-text">Eligible to receive grants</div>
            </div>
            <div class="feature" data-index="2" style="opacity: 0;">
                <div class="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                </div>
                <div class="feature-text">Free physical debit cards</div>
            </div>
        </div>
    </a>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }

    a:hover {
        text-decoration: none;
    }

    .banner {
        /* display: flex; */
        flex-direction: column;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        height: 100%;
        cursor: pointer; /* Add cursor pointer to indicate clickability */
        position: relative; /* For the overlay effect */
        transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth transition for hover effects */
    }

    /* Hover effects for better clickability */
    .banner:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    /* Active state for feedback when clicked */
    .banner:active {
        transform: translateY(1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Clickable overlay for the whole banner */
    .banner::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0);
        transition: background 0.2s ease;
        z-index: 1;
    }

    .banner:hover::after {
        background: rgba(255, 255, 255, 0.05);
    }

    .dark {
        background-color: #1c1c1e;
        color: white;
        border: 2px solid #d03a52;
    }

    .light {
        background-color: white;
        color: #1c1c1e;
        border: 2px solid #d03a52;
    }

    .header {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        position: relative;
        z-index: 2; /* Ensure content is above the overlay */
    }

    .logo-container {
        margin-right: 10px;
        flex-shrink: 0;
    }

    .logo-container img {
        width: 36px;
        height: 36px;
        display: block;
    }

    .text-container {
        flex: 1;
        min-width: 0;
    }

    .powered-by {
        font-size: 10px;
        margin-bottom: 2px;
        white-space: nowrap;
    }

    .dark .powered-by {
        color: #8e8e93;
    }

    .light .powered-by {
        color: #6e6e73;
    }

    .bank-name {
        font-size: 14.25px;
        font-weight: bold;
        letter-spacing: -0.6px;
        white-space: nowrap;
        overflow: hidden;
    }

    .feature-container {
        position: relative;
        height: 20px;
        overflow: hidden;
        margin-top: 10px;
        margin-bottom: 10px;
        z-index: 2; /* Ensure content is above the overlay */
    }

    .feature {
        display: flex;
        align-items: center;
        padding: 0 12px;
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        transition: transform 0.7s ease, opacity 0.7s ease;
        gap: 10px;
    }

    .feature:global(.active) {
        opacity: 1;
        transform: translateX(0); /* Center position */
    }

    .feature:global(.exit) {
        opacity: 0;
        transform: translateX(-100%); /* Exit to left */
    }

    .checkmark {
        width: 20px;
        height: 20px;
        background-color: #d03a52;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }

    .checkmark svg {
        width: 10px;
        height: 10px;
        fill: white;
    }

    .feature-text {
        font-size: 13px;
    }

    .dark .feature-text {
        color: #ffffff;
    }

    .light .feature-text {
        color: #1c1c1e;
    }

    /* Arrow pointing to right to indicate action */
    .bank-name::after {
        content: " →";
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .banner:hover .bank-name::after {
        opacity: 1;
    }

    /* Add slight border glow on hover to emphasize clickability */
    .banner {
        transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .dark:hover {
        box-shadow: 0 8px 16px rgba(208, 58, 82, 0.3);
    }

    .light:hover {
        box-shadow: 0 8px 16px rgba(208, 58, 82, 0.3);
    }
</style>
