var params = { data: {}, filter: "" };
var template_card =
	'<div class="card-image"></div>' +
	'<div class="card-body">' +
	'<h3 class="name-country">nom</h3>' +
	'<p class="infos-country">' +
	'<span class="text-infos">Population:</span>' +
	'<span class="value-infos info-population">5</span>' +
	"</p>" +
	'<p class="infos-country">' +
	'<span class="text-infos">Region:</span>' +
	'<span class="value-infos info-region">5</span>' +
	"</p>" +
	'<p class="infos-country">' +
	'<span class="text-infos">Capital:</span>' +
	'<span class="value-infos info-capital">9</span>' +
	"</p>" +
	"</div>";
NodeList.prototype.filter = function (callback) {
	const array = Array.from(this);
	return array.filter(callback);
};

HTMLElement.prototype.show = function (time = 1000, callback = () => {}) {
	var element = this;
	element.style.display = "block";
	element.style.animationDuration = time + "ms";
	element.classList.add("show");
	setTimeout(function () {
		element.classList.remove("show");
		callback;
	}, time);
};

HTMLElement.prototype.hide = function (time = 1000, callback = () => {}) {
	var element = this;
	element.style.animationDuration = time + "ms";
	element.classList.add("hide");
	setTimeout(function () {
		element.style.display = "none";
		element.classList.remove("hide");
		callback;
	}, time);
};
async function fetchJSONData(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}
async function load_countries() {
	var data = await fetchJSONData("data.json");
	return data;
}

function each(collection, callback) {
	if (Array.isArray(collection)) {
		for (let i = 0; i < collection.length; i++) {
			callback(i, collection[i], collection);
		}
	} else if (typeof collection === "object") {
		for (let key in collection) {
			if (collection.hasOwnProperty(key)) {
				callback(key, collection[key], collection);
			}
		}
	}
}

function search(event) {
	var val = this.value;

	document.querySelectorAll(".card").filter((element) => {
		if (
			element
				.querySelector(".name-country")
				.textContent.toLowerCase()
				.indexOf(val.toLowerCase()) == -1 ||
			element
				.querySelector(".info-region")
				.textContent.toLowerCase()
				.indexOf(params.filter.toLowerCase()) == -1
		) {
			element.hide(300);
		} else {
			element.show(300);
		}
	});
}

function filter(region) {
	params.filter = region;
	document.querySelector(".filter-name").textContent =
		region != "" ? region : "Region";
	var val = document.getElementById("search").value;
	document.querySelectorAll(".card").filter((element) => {
		if (
			element
				.querySelector(".info-region")
				.textContent.toLowerCase()
				.indexOf(region.toLowerCase()) == -1 ||
			element
				.querySelector(".name-country")
				.textContent.toLowerCase()
				.indexOf(val.toLowerCase()) == -1
		) {
			element.hide(300);
		} else {
			element.show(300);
		}
	});
}

function showBorder(border) {
	showDetail(params.data[border]);
}

function showDetail(element) {
	var page_details = document.querySelector(".page-details");
	var page_list = document.querySelector(".page-list");

	page_details
		.querySelector(".image-detail")
		.setAttribute("src", element.flags.svg);
	page_details.querySelector(".country-name").textContent =
		element.name ?? "N/A";
	page_details.querySelector(".info-native-name").textContent =
		element.nativeName ?? "N/A";
	page_details.querySelector(".info-population").textContent =
		element.population.toLocaleString("en-US") ?? 0;
	page_details.querySelector(".info-region").textContent =
		element.region ?? "N/A";
	page_details.querySelector(".info-sub-region").textContent =
		element.subregion ?? "N/A";
	page_details.querySelector(".info-capital").textContent =
		element.capital ?? "N/A";
	page_details.querySelector(".info-top-level-domain").textContent =
		Array.isArray(element.topLevelDomain)
			? element.topLevelDomain.join(", ")
			: element.topLevelDomain;
	page_details.querySelector(".info-currencies").textContent = Array.isArray(
		element.currencies
	)
		? element.currencies.map((currencie) => currencie.name).join(", ")
		: "N/A";
	page_details.querySelector(".info-languages").textContent = Array.isArray(
		element.languages
	)
		? element.languages.map((language) => language.name).join(", ")
		: "N/A";
	page_details.querySelector(".border-countries-list").innerHTML =
		Array.isArray(element.borders)
			? element.borders
					.map(
						(border) =>
							"<span onclick=\"showBorder('" +
							border +
							'\')" class="border-c">' +
							params.data[border].name +
							"</span>"
					)
					.join("")
			: "N/A";

	document.querySelector(".main-container").classList.add("details");
	page_list.hide(600);
	page_details.show(600);
}

function back() {
	var page_details = document.querySelector(".page-details");
	var page_list = document.querySelector(".page-list");
	document.querySelector(".main-container").classList.toggle("details");
	page_list.show(600);
	page_details.hide(600);
}

load_countries().then(function (data) {
	each(data, (index, element) => {
		const template = document.getElementById("card-template");
		var country = document.createElement("div");
		country.className = "card";
		country.innerHTML = template_card;
		country.querySelector(".card-image").innerHTML =
			'<img class="img-country" src="' + element.flags.png + '"/>';
		country.querySelector(".name-country").innerHTML = element.name;
		country.querySelector(".info-population").innerHTML =
			element.population.toLocaleString("en-US") ?? 0;
		country.querySelector(".info-region").innerHTML = element.region ?? "N/A";
		country.querySelector(".info-capital").innerHTML = element.capital ?? "N/A";
		country.addEventListener("click", () => showDetail(element));
		document.querySelector(".card-container").appendChild(country);
		country.show(300);
		params.data[element.alpha3Code] = element;
	});
});

document.querySelectorAll(".card").forEach((element) => {
	element.addEventListener("click", function (e) {
		alert("click");
	});
});

document.getElementById("search").addEventListener("input", search);

document.querySelector(".toggler").addEventListener("click", function (e) {
	var body = document.querySelector("body");
	body.classList.toggle("dark-mode");
	var icon = this.querySelector(".toggle-icon i");
	if (icon.classList.contains("fa-regular")) {
		icon.classList.replace("fa-regular", "fa-solid");
	} else {
		icon.classList.replace("fa-solid", "fa-regular");
	}
});
document.querySelector(".filter-panel").addEventListener("click", function (e) {
	var list = this.querySelector(".list-items");
	if (list.classList.contains("shower")) {
		list.classList.replace("shower", "hidden");
	} else {
		list.classList.replace("hidden", "shower");
	}
});
