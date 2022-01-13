/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function () {
  // FitVids init
  $("#main").fitVids();

  // Sticky sidebar
  var stickySideBar = function () {
    var show =
      $(".author__urls-wrapper button").length === 0
        ? $(window).width() > 1024 // width should match $large Sass variable
        : !$(".author__urls-wrapper button").is(":visible");
    if (show) {
      // fix
      $(".sidebar").addClass("sticky");
    } else {
      // unfix
      $(".sidebar").removeClass("sticky");
    }
  };

  stickySideBar();

  $(window).resize(function () {
    stickySideBar();
  });

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Close search screen with Esc key
  $(document).keyup(function (e) {
    if (e.keyCode === 27) {
      if ($(".initial-content").hasClass("is--hidden")) {
        $(".search-content").toggleClass("is--visible");
        $(".initial-content").toggleClass("is--hidden");
      }
    }
  });

  // Search toggle
  $(".search__toggle").on("click", function () {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");
    // set focus on input
    setTimeout(function () {
      $(".search-content input").focus();
    }, 400);
  });

  // Smooth scrolling
  var scroll = new SmoothScroll('a[href*="#"]', {
    offset: 20,
    speed: 400,
    speedAsDuration: true,
    durationMax: 500,
  });

  // Gumshoe scroll spy init
  if ($("nav.toc").length > 0) {
    var spy = new Gumshoe("nav.toc a", {
      // Active classes
      navClass: "active", // applied to the nav list item
      contentClass: "active", // applied to the content

      // Nested navigation
      nested: false, // if true, add classes to parents of active link
      nestedClass: "active", // applied to the parent items

      // Offset & reflow
      offset: 20, // how far from the top of the page to activate a content area
      reflow: true, // if true, listen for reflows

      // Event support
      events: true, // if true, emit custom events
    });
  }

  // add lightbox class to all image links
  $(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
  ).addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function () {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      },
    },
    closeOnContentClick: true,
    midClick: true, // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  // Add anchors for headings
  $(".page__content")
    .find("h1, h2, h3, h4, h5, h6")
    .each(function () {
      var id = $(this).attr("id");
      if (id) {
        var anchor = document.createElement("a");
        anchor.className = "header-link";
        anchor.href = "#" + id;
        anchor.innerHTML =
          '<span class="sr-only">Permalink</span><i class="fas fa-link"></i>';
        anchor.title = "Permalink";
        $(this).append(anchor);
      }
    });

  nameSort = function (direction = 1, a, b) {
    return a
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") <
      b
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
      ? -1 * direction
      : direction;
  };

  // get plataform users
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://plataforma.nortanengenharia.com/api/public/user/all",
    true
  );
  xhr.send(JSON.stringify({}));

  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;

    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      data = data.sort((a, b) => {
        return nameSort(1, a.fullName, b.fullName);
      });
      data.splice(
        data.findIndex(
          (member) => member.fullName == "Augusto Ícaro Farias da Cunha"
        ),
        1
      );
      const augusto = data.splice(
        data.findIndex(
          (member) => member.fullName == "José Augusto Gomes da Cunha"
        ),
        1
      );
      data.unshift(augusto[0]);
      const jessica = data.splice(
        data.findIndex((member) => member.fullName == "Jéssica Gonçalves"),
        1
      );
      data.unshift(jessica[0]);
      const hugo = data.splice(
        data.findIndex(
          (member) => member.fullName == "Augusto Hugo Farias da Cunha"
        ),
        1
      );
      data.unshift(hugo[0]);
      var wrapperDiv = '<div class="feature__wrapper">';

      for (const member of data) {
        var excerpt = "";
        switch (member.fullName) {
          case "Augusto Hugo Farias da Cunha":
            excerpt =
              "Diretor Executivo - CEO<br/>" + member.mainDepartment.slice(6);
            break;
          case "Jéssica Gonçalves":
            excerpt =
              "Diretora de Marketing<br/>" + member.mainDepartment.slice(6);
            break;
          case "Tales Augusto Costa Gomes":
            excerpt =
              "Diretor de Operações<br/>" + member.mainDepartment.slice(6);
            break;
          default:
            excerpt = member.mainDepartment.slice(6);
            break;
        }
        const el =
          `<div class="feature__item--team"><div class="archive__item"><div class="archive__item-teaser"><img src="` +
          member.profilePicture +
          `" alt="` +
          member.fullName +
          `" style="" /></div><div class="archive__item-body"><h2 class="archive__item-title">` +
          (member.exibitionName ? member.exibitionName : member.fullName) +
          `</h2><div class="archive__item-excerpt"><p><strong>` +
          excerpt +
          `</strong></p></div></div></div></div>`;
        wrapperDiv += el;
      }
      wrapperDiv += "</div>";

      // we get the returned data
      var sliderData = document.querySelector("#slider3");
      if (sliderData) {
        sliderData.insertAdjacentHTML("afterbegin", wrapperDiv);
      }

      var slider = new IdealHTMLSlider.Slider({
        selector: "#slider3",
        height: "auto",
        initialHeight: 300,
        maxHeight: 500,
        interval: 3000,
        group: 4,
        groupClasses: "feature__wrapper",
        hasBorder: false,
      });
      slider.addBulletNav();
      slider.start();
    }

    // end of state change: it can be after some time (async)
  };

  // fix nav height
  var el = document.querySelector(".nav-tabs");
  if (el) el.style.height = getComputedStyle(el).height;
});
