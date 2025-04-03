

async function loadPage(pageUrl,button) {
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".content-area").innerHTML = data;

    // Remove 'selected' class from all buttons
    document.querySelectorAll('.menu-element').forEach(btn => btn.classList.remove('selected'));
    // Add 'selected' class to the clicked button
    button.classList.add('selected');
}

async function loadSubPage(pageUrl,button){
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".container").innerHTML = data;

    // Remove 'active' class from all buttons
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    // Add 'active' class to the clicked button
    button.classList.add('active');
}