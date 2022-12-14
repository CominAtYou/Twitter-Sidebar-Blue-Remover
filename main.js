// Localizations of the "Lists" text in the sidebar. Still a work in progress.
const LISTS_TEXT_PER_LOCALE = {
    ar: "القوائم", // Arabic
    "ar-x-fm": "القوائم", // Arabic (Feminine)
    bn: "তালিকা", // Bengali
    eu: "Zerrendak", // Basque
    en: "Lists", // English (US)
    "en-gb": "Lists", // English (UK)
    bg: "Списъци", // Bulgarian
    ca: "Llistes", // Catalan
    hr: "Popisi", // Croatian
    cs: "Seznamy", // Czech
    da: "Lister", // Danish
    nl: "Lijsten", // Dutch
    fil: "Mga Listahan", // Filipino
    fi: "Listat", // Finnish
    fr: "Listes", // French
    gl: "Listaxes", // Galician
    de: "Listen", // German
    el: "Λίστες", // Greek
    es: "Listas", // Spanish
    id: "Daftar", // Indonesian
    it: "Liste", // Italian
    ms: "Senarai", // Malay
    nb: "Lister", // Norwegian
    ko: "리스트", // Korean
    jp: "リスト", // Japanese
    pl: "Listy", // Polish
    pt: "Listas", // Portuguese
    ru: "Списки", // Russian
    sv: "Listor", // Swedish
};

/** @param { any[] } a @param { any[] } b */
function arrayEquals(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

function main() {
    /** @type { Element[] } */
    const elements = Array.prototype.slice.call(document.getElementsByClassName("r-1habvwh"));

    // lists are /username/lists instead of /i/lists, so this is used to just get the username of the current user
    const profileButton = elements.find(elem => elem.hasAttribute("href") && elem.getAttribute("data-testid") === "AppTabBar_Profile_Link");
    const twitterBlueButton = elements.find(elem => elem.hasAttribute("href") && elem.getAttribute("href") === "/i/twitter_blue_sign_up");

    if (!twitterBlueButton) {
        console.error("Failed to find Twitter Blue button");
        return;
    }

    if (!profileButton) {
        console.error("Failed to find profile button");
        return;
    }

    // remove and re-add the element to shake off the onclick listeners
    const blueButtonParent = twitterBlueButton.parentElement;
    const blueButtonHTML = twitterBlueButton.outerHTML;
    const index = Array.prototype.indexOf.call(blueButtonParent.children, twitterBlueButton);
    blueButtonParent.removeChild(twitterBlueButton);

    // Add the element back in
    const newElement = document.createElement("div");
    newElement.insertAdjacentHTML('afterbegin', blueButtonHTML);

    /** @type { HTMLAnchorElement } */
    const listsButton = blueButtonParent.insertBefore(newElement.firstElementChild, blueButtonParent.children[index]);

    /** @type { HTMLDivElement } — Direct child of the Twitter Blue button. */
    const listsButtonChildDiv = listsButton.querySelector('div:first-of-type');

    // Add the hover effect back
    listsButton.addEventListener("mouseover", () => {
        listsButtonChildDiv.classList.add("r-1ydqjzz", "r-1hdo0pc");
    });

    listsButton.addEventListener("mouseout", () => {
        listsButtonChildDiv.classList.remove("r-1ydqjzz", "r-1hdo0pc");
    });

    // Find the icon element
    const iconElement = listsButton.querySelector('svg');

    if (!iconElement) {
        console.error("Failed to find Twitter Blue icon");
        return;
    }

    const svgPath = iconElement.querySelector('path');
    if (!svgPath) {
        console.error("Failed to find Twitter Blue icon path");
        return;
    }

    /** @type { HTMLDivElement } — This div contains some wrappers for the list button label. */
    let listsButtonTextContainer = listsButton.querySelector('div[dir]');

    // If the page is loaded and the viewport is small enough that the small sidebar is shown, the text element will need to be created manually
    if (!listsButtonTextContainer) {
        console.log("Button label wrapper element not found, manually creating it.");
        const textContainer = document.createElement("div");
        textContainer.classList.add("css-901oao", "css-1hf3ou5", "r-18jsvk2", "r-37j5jr", "r-adyw6z", "r-16dba41", "r-135wba7", "r-1joea0r", "r-88pszg", "r-bcqeeo", "r-qvutc0");

        const textSpan = document.createElement('span');
        textSpan.classList.add("css-901oao", "css-16my406", "r-poiln3", "r-bcqeeo", "r-qvutc0", "__sidebar-element-text-color-light-when-dark");
        textContainer.appendChild(textSpan);
        listsButtonTextContainer = listsButtonChildDiv.appendChild(textContainer);
    }

    const listsButtonLabel = listsButtonTextContainer.querySelector('span');

    // Add a class that will hide the text when the viewport shrinks enough
    listsButtonTextContainer.classList.add("__sidebar-element-hidden-on-viewport-shrink");

    // Set the text
    const locale = document.documentElement.lang.toLowerCase();
    listsButtonLabel.innerText = LISTS_TEXT_PER_LOCALE[locale];
    listsButton.setAttribute("aria-label", LISTS_TEXT_PER_LOCALE[locale]);

    // Set the icon
    svgPath.setAttribute('d', `M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z`);

    // Set the button to open the lists page
    listsButton.setAttribute("href", profileButton.getAttribute("href") + "/lists");
}

// Add a listener to wait for the sidebar to load
const observer = new MutationObserver((mutationList, observer) => {
    const SIDEBAR_CLASS_LIST = "css-1dbjc4n r-1pi2tsx r-1wtj0ep r-1rnoaur r-1e081e0 r-o96wvk".split(" ");
    const SMALL_SIDEBAR_CLASS_LIST = "css-1dbjc4n r-1pi2tsx r-1wtj0ep r-1rnoaur r-1e081e0 r-f9dfq4".split(" ");
    const TINY_SIDEBAR_CLASS_LIST = "css-1dbjc4n r-1pi2tsx r-1wtj0ep r-1rnoaur r-s1qlax r-1gymjhz".split(" ");

    for (const mutation of mutationList) {
        const addedNodes = Array.from(mutation.addedNodes);
        for (const node of addedNodes) {
            const classList = Array.from(node.classList);
            if (arrayEquals(classList, SIDEBAR_CLASS_LIST) || arrayEquals(classList, SMALL_SIDEBAR_CLASS_LIST) || arrayEquals(classList, TINY_SIDEBAR_CLASS_LIST)) {
                observer.disconnect();
                console.log("Found sidebar!");

                // The Blue button gets restored when the system theme is changed
                // listen for a theme change and run the button function again
                matchMedia("(prefers-color-scheme: dark)").onchange = main;
                main();

                return;
            }
        }
    }
});

if (Object.keys(LISTS_TEXT_PER_LOCALE).includes(document.documentElement.lang.toLowerCase())) {
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}