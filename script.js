document.addEventListener("DOMContentLoaded", () => {

	//do scipad page 162!!!!

	// Populate the captcha with the image split up
	generateCaptcha("./image.png");

});


function generateCaptcha(imagePath) {
	addImages(imagePath);
	addEventListeners();
}

function addImages(imagePath) {
	
	// Get the canvas
	const canvas = document.getElementById("captchaCanvas");
	const context = canvas.getContext("2d");

	// Load the image to be split up
	const captchaImage = new Image();
	captchaImage.onload = () => {

		// Set the canvas to the size of one of the 3x3 tiles
		const width = captchaImage.width;
		const height = captchaImage.height;
		canvas.width = width / 3;
		canvas.height = height / 3;

		// Loop through a 3x3 grid of the image
		let index = 0;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				
				// Figure out the part of the image that needs to be drawn
				context.drawImage(captchaImage, (j * width / 3), (i * height / 3), width / 3, height / 3, 0, 0, width / 3, height / 3);

				// Add the image to the captcha DOM
				document.querySelectorAll(".images img")[index].src = canvas.toDataURL();
				index++;
			}
		}
	};
	captchaImage.src = imagePath;

	// Check for if the verify button is pressed
	document.querySelector("#captchaVerify").addEventListener("click", () => {

		//TODO: Don't hardcode this
		const correctIndexes = [0, 1, 3, 4, 7];
		let indexes = [];
		for (let i = 0; i < 9; i++) {
			
			// Check for if the current element is selected
			if (document.querySelectorAll(".image-grid .image")[i].classList.contains("selected")) indexes.push(i);
		}

		// Check for if they got all tiles correct
		if (JSON.stringify(indexes) === JSON.stringify(correctIndexes)) {

			// Hide the captcha
			//TODO: Actually do something
			document.querySelector(".captcha").style.display = "none";
		}
		else {

			// Rest all of the images
			document.querySelectorAll(".images .image").forEach(image => {
				image.classList.remove("selected");
				image.querySelector(".tick").classList.add("hidden");
			});
			
			// Add an error message if there isn't one there already
			if (!document.querySelector(".image-grid p").classList.contains("error")) {
				document.querySelector(".image-grid p").classList.add("error");
			}
		}
	});
}


// Add all of the event listeners to the image
function addEventListeners() {

	// Check for if an image is selected
	document.querySelectorAll(".images .image").forEach(image => {
		image.addEventListener("click", () => {

			// Toggle the 'selected' class
			image.classList.toggle("selected");

			// Toggle the tick
			image.querySelector(".tick").classList.toggle("hidden");
		});
	});
}




// Check for if they paste an image in
document.addEventListener("paste", e => {

	// Get everything in the clipboard
	const clipboard = e.clipboardData.items;
	if (!clipboard) return;

	// Get the first image in the users clipboard
	for (let i = 0; i < clipboard.length; i++) {
		
		if (clipboard[i].type.indexOf("image") !== -1) {

			// Get the image
			const currentImage = clipboard[i].getAsFile();
			const fileReader = new FileReader();

			// Get the image src
			fileReader.onload = () => {
				
				// Make a new captcha
				addImages(fileReader.result);
			}
			fileReader.readAsDataURL(currentImage);

		}
		
	}
});