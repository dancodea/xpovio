/**
 * Xpovio Astro Lifecycle & Animation Controller
 * Handles initialization and cleanup across View Transitions (astro:page-load & astro:before-swap)
 */

(function () {
  let bannerThreeTick = null;
  let cursorInitialized = false;

  function cleanupApp() {
    // Clear banner three timer
    if (bannerThreeTick) {
      clearInterval(bannerThreeTick);
      bannerThreeTick = null;
    }

    // Kill all GSAP ScrollSmoother & ScrollTrigger instances
    if (window.ScrollSmoother && typeof ScrollSmoother.get === "function") {
      const smoother = ScrollSmoother.get();
      if (smoother) {
        try {
          smoother.kill();
        } catch (e) {}
      }
    }

    if (window.ScrollTrigger && typeof ScrollTrigger.getAll === "function") {
      ScrollTrigger.getAll().forEach((t) => {
        try {
          t.kill();
        } catch (e) {}
      });
    }

    // Destroy slick sliders
    if (window.jQuery) {
      const $ = window.jQuery;
      $(".slick-initialized").each(function () {
        try {
          $(this).slick("unslick");
        } catch (e) {}
      });
    }

    // Reset mobile and offcanvas menu state
    if (document.body) {
      document.body.classList.remove("body-active");
    }
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) mobileMenu.classList.remove("show-menu");
    const mobileBackdrop = document.querySelector(".mobile-menu__backdrop");
    if (mobileBackdrop) mobileBackdrop.classList.remove("mobile-menu__backdrop-active");
    const offcanvasMenu = document.querySelector(".offcanvas-menu");
    if (offcanvasMenu) offcanvasMenu.classList.remove("show-offcanvas-menu");
  }

  function initApp() {
    if (!window.jQuery) return;
    const $ = window.jQuery;
    const device_width = window.innerWidth;

    // 01. Preloader Fade Out (Immediate, smooth, non-blocking)
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.transition = "opacity 0.3s ease, visibility 0.3s ease";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.style.pointerEvents = "none";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 300);
    }
    $("#preloader").fadeOut(300);

    // 02. Copyright Year
    const yearEl = document.getElementById("copyYear");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // 03. Data Background
    $("[data-background]").each(function () {
      const bg = $(this).attr("data-background");
      if (bg) {
        $(this).css("background-image", "url(" + bg + ")");
      }
    });

    // 04. Sticky Navbar & Scroll Progress Initial State
    const initialScroll = $(window).scrollTop();
    if (initialScroll >= 100) {
      $(".primary-navbar").addClass("navbar-active");
      $(".progress-wrap").addClass("active-progress");
    }

    // Scroll listener for Navbar & Progress Button
    $(window).off("scroll.xpovio").on("scroll.xpovio", function () {
      const scroll = $(window).scrollTop();
      if (scroll < 100) {
        $(".primary-navbar").removeClass("navbar-active");
      } else {
        $(".primary-navbar").addClass("navbar-active");
      }

      if (scroll > 50) {
        $(".progress-wrap").addClass("active-progress");
      } else {
        $(".progress-wrap").removeClass("active-progress");
      }
    });

    // 05. Scroll to Top Progress SVG Calculation
    if ($(".progress-wrap").length > 0) {
      const progressPath = document.querySelector(".progress-wrap path");
      if (progressPath) {
        const pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = "none";
        progressPath.style.strokeDasharray = pathLength + " " + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = "stroke-dashoffset 10ms linear";

        const updateProgress = function () {
          const scroll = $(window).scrollTop();
          const height = $(document).height() - $(window).height();
          if (height > 0) {
            const progress = pathLength - (scroll * pathLength) / height;
            progressPath.style.strokeDashoffset = progress;
          }
        };

        updateProgress();
        $(window).off("scroll.xpovioProgress").on("scroll.xpovioProgress", updateProgress);

        $(".progress-wrap").off("click").on("click", function (event) {
          event.preventDefault();
          $("html, body").animate({ scrollTop: 0 }, 800);
          return false;
        });
      }
    }

    // 06. Custom Dual Cursor
    const cursorOuter = document.querySelector(".cursor-outer");
    const cursorInner = document.querySelector(".cursor-inner");
    if (cursorOuter && cursorInner) {
      cursorOuter.style.visibility = "visible";
      cursorInner.style.visibility = "visible";

      if (!cursorInitialized) {
        cursorInitialized = true;
        window.addEventListener("mousemove", function (s) {
          cursorOuter.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
          cursorInner.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
        });

        $(document).on("mouseenter", "button, a, .cursor-pointer, .single-item", function () {
          const inner = document.querySelector(".cursor-inner");
          const outer = document.querySelector(".cursor-outer");
          if (inner && outer) {
            inner.classList.add("cursor-hover");
            outer.classList.add("cursor-hover");
          }
        });

        $(document).on("mouseleave", "button, a, .cursor-pointer, .single-item", function () {
          const inner = document.querySelector(".cursor-inner");
          const outer = document.querySelector(".cursor-outer");
          if (inner && outer) {
            inner.classList.remove("cursor-hover");
            outer.classList.remove("cursor-hover");
          }
        });
      }
    }

    // 07. Mobile Menu Population & Handlers
    if ($(".mobile-menu").length) {
      const $mobileList = $(".mobile-menu__list");
      if ($mobileList.children().length === 0) {
        const mobileMenuContent = $(".cmn-nav .navbar__menu, .quinary--navbar .navbar__menu").html();
        if (mobileMenuContent) {
          $mobileList.html(mobileMenuContent);
        }
      }

      const $mobileOpts = $(".mobile-menu__options");
      if ($mobileOpts.children().length === 0) {
        const mobileMenuOptions = $(".cmn-nav .navbar__mobile-options, .quinary--navbar .navbar__mobile-options").html();
        if (mobileMenuOptions) {
          $mobileOpts.html(mobileMenuOptions);
        }
      }

      $(".mobile-menu .navbar__dropdown-label").off("click").on("click", function () {
        $(this).parent().siblings().find(".navbar__sub-menu").slideUp(300);
        $(this).parent().siblings().find(".navbar__dropdown-label").removeClass("navbar__item-active");
        $(this).siblings(".navbar__sub-menu").slideToggle(300);
        $(this).toggleClass("navbar__item-active");
      });
    }

    $(".open-mobile-menu").off("click").on("click", function () {
      $(".mobile-menu__backdrop").addClass("mobile-menu__backdrop-active");
      $(".mobile-menu .nav-fade").each(function (i) {
        $(this).css("animation-delay", 0.2 * 1 * i + "s");
      });
      $(".mobile-menu").addClass("show-menu");
      $(".mobile-menu__wrapper").removeClass("nav-fade-active");
    });

    $(".close-mobile-menu, .mobile-menu__backdrop").off("click").on("click", function () {
      setTimeout(function () {
        $(".mobile-menu").removeClass("show-menu");
      }, 700);
      setTimeout(function () {
        $(".mobile-menu__backdrop").removeClass("mobile-menu__backdrop-active");
      }, 900);
      $(".mobile-menu__wrapper").addClass("nav-fade-active");
    });

    // 08. Offcanvas Menu Handlers
    if ($(".offcanvas-nav").length) {
      $(".offcanvas-menu .navbar__dropdown-label").off("click").on("click", function () {
        $(this).parent().siblings().find(".navbar__sub-menu").slideUp(300);
        $(this).parent().siblings().find(".navbar__dropdown-label").removeClass("navbar__item-active");
        $(this).siblings(".navbar__sub-menu").slideToggle(300);
        $(this).toggleClass("navbar__item-active");
      });
    }

    $(".open-offcanvas-nav").off("click").on("click", function () {
      $(".offcanvas-menu .nav-fade").each(function (i) {
        $(this).css("animation-delay", 0.8 + 0.15 * i + "s");
      });
      $(".offcanvas-menu").addClass("show-offcanvas-menu");
      $(".offcanvas-menu__wrapper").removeClass("nav-fade-active");
    });

    $(".close-offcanvas-menu, .offcanvas-menu__backdrop").off("click").on("click", function () {
      setTimeout(function () {
        $(".offcanvas-menu").removeClass("show-offcanvas-menu");
      }, 700);
      $(".offcanvas-menu__wrapper").addClass("nav-fade-active");
    });

    // 09. Video Modal Popup Handlers
    $(".close-v").off("click").on("click", function () {
      $(".vid-m").fadeOut(300);
    });

    if ($.fn.magnificPopup && $(".video-btn").length > 0) {
      $(".video-btn").magnificPopup({
        disableOn: 768,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
      });
    }

    // 10. Nice Select
    if ($.fn.niceSelect && $(".subject, select.nice-select-init").length > 0) {
      $(".subject, select.nice-select-init").niceSelect();
    }

    // 11. Interactive Hover & Cursor Follow Effects
    $(".portfolio__single").off("mouseover").on("mouseover", function () {
      $(".portfolio__single").removeClass("portfolio__single-active");
      $(this).addClass("portfolio__single-active");
    });

    $(".work-steps__single").off("mouseover").on("mouseover", function () {
      $(".work-steps__single").removeClass("work-steps__single-active");
      $(this).addClass("work-steps__single-active");
    });

    if (device_width > 576) {
      const offerImgItems = document.querySelectorAll(".offer__cta-single");
      offerImgItems.forEach((item) => {
        item.addEventListener("mousemove", (event) => {
          const contentBox = item.getBoundingClientRect();
          const dx = event.clientX - contentBox.x;
          const dy = event.clientY - contentBox.y;
          if (item.children[2]) {
            item.children[2].style.transform = `translate(${dx}px, ${dy}px) rotate(15deg)`;
          }
        });
      });

      const workImgItems = document.querySelectorAll(".work-steps__single");
      workImgItems.forEach((item) => {
        item.addEventListener("mousemove", (event) => {
          const contentBox = item.getBoundingClientRect();
          const dx = event.clientX - contentBox.x;
          const dy = event.clientY - contentBox.y;
          if (item.children[2]) {
            item.children[2].style.transform = `translate(${dx}px, ${dy}px)`;
          }
        });
      });
    }

    // 12. Accordions & FAQ Toggle
    $(".service-f-single:first").addClass("service-f-single-active");
    $(".service-f-single:first .p-single").show();
    $(".toggle-service-f").off("click").on("click", function () {
      const parent = $(this).parent();
      parent.find(".p-single").slideToggle(500);
      parent.toggleClass("service-f-single-active");
      parent.siblings().removeClass("service-f-single-active");
      parent.siblings().find(".p-single").slideUp(500);
    });

    $(".accordion-button:not(.collapsed)").parents(".accordion-item").addClass("faq-one-active");
    $(".accordion-button").off("click").on("click", function () {
      $(".accordion-item").removeClass("faq-one-active");
      setTimeout(() => {
        $(".accordion-button:not(.collapsed)").parents(".accordion-item").addClass("faq-one-active");
      }, 100);
    });

    // 13. Blog Three Image Hover Animation
    $(".blog-three__thumb .blog-single-img:not(:first-child)").hide();
    $(".blog-three__single").off("mouseenter").on("mouseenter", function () {
      if ($(this).hasClass("active")) return;
      const index = $(this).index();
      if (window.gsap) {
        gsap.to(".blog-three__thumb .blog-single-img", {
          opacity: 0,
          scale: 0,
          duration: 0.4,
          onComplete: function () {
            $(".blog-three__thumb .blog-single-img").hide();
            $(".blog-three__thumb .blog-single-img").eq(index).show();
            gsap.fromTo(
              ".blog-three__thumb .blog-single-img",
              { opacity: 0, scale: 0 },
              { opacity: 1, scale: 1, duration: 0.4 }
            );
          },
        });
      }
      $(".blog-three__single").removeClass("active");
      $(this).addClass("active");
    });

    // 14. Vanilla Tilt
    if (window.VanillaTilt && document.querySelectorAll(".topy-tilt").length > 0) {
      VanillaTilt.init(document.querySelectorAll(".topy-tilt"), {
        max: 5,
        speed: 3000,
      });
    }

    // 15. Slick Sliders Initializations
    if ($.fn.slick) {
      // Portfolio Text Slider
      $(".portfolio__text-slider").not(".slick-initialized").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        cssEase: "linear",
        variableWidth: true,
      });

      // Testimonial Text Slider
      $(".testimonial__text-slider").not(".slick-initialized").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        cssEase: "linear",
        variableWidth: true,
      });

      // Sponsor Slider
      $(".sponsor__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 6,
        speed: 1000,
        autoplaySpeed: 3000,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        centerMode: true,
        centerPadding: "0px",
        responsive: [
          { breakpoint: 1700, settings: { slidesToShow: 5 } },
          { breakpoint: 1400, settings: { slidesToShow: 4 } },
          { breakpoint: 1200, settings: { slidesToShow: 3 } },
          { breakpoint: 576, settings: { slidesToShow: 2 } },
        ],
      });

      // Next Page Text Slider
      $(".next__text-slider").not(".slick-initialized").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        arrows: false,
        dots: false,
        pauseOnHover: true,
        draggable: false,
        variableWidth: true,
        cssEase: "linear",
      });

      // Offer Two Sliders
      $(".offer-two__slider").not(".slick-initialized").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        arrows: false,
        dots: false,
        pauseOnHover: true,
        draggable: false,
        variableWidth: true,
        cssEase: "linear",
      });

      $(".offer-two__slider-rtl").not(".slick-initialized").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        arrows: false,
        dots: false,
        pauseOnHover: true,
        draggable: false,
        variableWidth: true,
        rtl: true,
        cssEase: "linear",
      });

      // Testimonial Two Slider
      $(".testimonial-two__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 1,
        speed: 1000,
        autoplaySpeed: 3000,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        centerMode: true,
        centerPadding: "0px",
      });

      // Blog Two Slider
      $(".blog-two__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 3,
        speed: 1000,
        autoplaySpeed: 4000,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".prev-blog"),
        nextArrow: $(".next-blog"),
        dots: false,
        centerMode: true,
        centerPadding: "0px",
        responsive: [
          { breakpoint: 1200, settings: { slidesToShow: 2 } },
          { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
      });

      // Portfolio Three Slider
      $(".portfolio-three__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 1,
        speed: 1000,
        autoplaySpeed: 6000,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".prev-portfolio"),
        nextArrow: $(".next-portfolio"),
        dots: false,
        centerMode: true,
        centerPadding: "25%",
        draggable: false,
        responsive: [
          { breakpoint: 1200, settings: { centerPadding: "10%" } },
          { breakpoint: 576, settings: { centerPadding: "0%" } },
        ],
      });

      // Testimonial Three Slider
      $(".testimonial-s__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 1,
        speed: 1000,
        autoplaySpeed: 5000,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".prev-testimonial-three"),
        nextArrow: $(".next-testimonial-three"),
        dots: false,
        centerMode: true,
        centerPadding: "0px",
      });

      // Project Text Slider
      $(".project__text-slider").not(".slick-initialized").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        arrows: false,
        dots: false,
        pauseOnHover: true,
        draggable: false,
        variableWidth: true,
        cssEase: "linear",
      });

      // Team Slider
      $(".team-s__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 2,
        speed: 1000,
        autoplaySpeed: 3000,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".prev-team-s"),
        nextArrow: $(".next-team-s"),
        dots: false,
        centerMode: true,
        centerPadding: "0%",
        pauseOnHover: true,
        variableWidth: true,
        responsive: [
          { breakpoint: 768, settings: { slidesToShow: 2, variableWidth: false, centerPadding: "5%" } },
          { breakpoint: 576, settings: { slidesToShow: 1, variableWidth: false, centerPadding: "5%" } },
        ],
      });

      // Achievements Slider
      $(".achievements__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 5,
        speed: 1000,
        autoplaySpeed: 3000,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        responsive: [
          { breakpoint: 1200, settings: { slidesToShow: 4 } },
          { breakpoint: 768, settings: { slidesToShow: 3 } },
          { breakpoint: 576, settings: { slidesToShow: 2 } },
          { breakpoint: 375, settings: { slidesToShow: 1 } },
        ],
      });

      // Service Plan Slider
      $(".service-t__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 4,
        speed: 1000,
        autoplaySpeed: 5000,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".prev-service-t"),
        nextArrow: $(".next-service-t"),
        dots: false,
        centerMode: true,
        centerPadding: "0px",
        responsive: [
          { breakpoint: 1400, settings: { slidesToShow: 3 } },
          { breakpoint: 1200, settings: { slidesToShow: 2 } },
          { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
      });

      // Poster Slider
      $(".poster__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 1,
        speed: 1000,
        autoplaySpeed: 4000,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".prev-project-d"),
        nextArrow: $(".next-project-d"),
        dots: false,
        centerMode: true,
        centerPadding: "0px",
      });

      // Project Details Slider
      $(".project-d__slider").not(".slick-initialized").slick({
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 3,
        speed: 1000,
        autoplaySpeed: 4000,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        centerMode: true,
        centerPadding: "15%",
        responsive: [
          { breakpoint: 1400, settings: { slidesToShow: 2 } },
          { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
      });

      // Banner Three Slider with Progress
      if ($(".banner-three__slider").length > 0) {
        $(".banner-three__slider").not(".slick-initialized").slick({
          infinite: true,
          arrows: false,
          dots: false,
          autoplay: false,
          speed: 800,
          autoplaySpeed: 4000,
          slidesToShow: 1,
          slidesToScroll: 1,
        });

        let percentTime = 0;
        let progressBarIndex = 0;
        const time = 0.1;

        $(".slider-progress").each(function (index) {
          $(this).html("<div class='inProgress inProgress" + index + "'></div>");
        });

        function resetProgressbar() {
          $(".inProgress").css({ width: "0%" });
          if (bannerThreeTick) clearInterval(bannerThreeTick);
        }

        function startProgressbar() {
          resetProgressbar();
          percentTime = 0;
          bannerThreeTick = setInterval(function () {
            percentTime += 1 / (time + 5);
            $(".inProgress" + progressBarIndex).css({ width: percentTime + "%" });
            if (percentTime >= 100) {
              $(".banner-three__slider").slick("slickNext");
              progressBarIndex++;
              if (progressBarIndex > 2) progressBarIndex = 0;
              startProgressbar();
            }
          }, 10);
        }

        startProgressbar();
        $(".single-item:first-child").addClass("single-item-active");

        $(".single-item").off("click").on("click", function () {
          resetProgressbar();
          $(".single-item").removeClass("single-item-active");
          $(this).addClass("single-item-active");
          const goToThisIndex = $(this).find("div").data("slickIndex") || $(this).index();
          $(".banner-three__slider").slick("slickGoTo", goToThisIndex, false);
          progressBarIndex = goToThisIndex;
          startProgressbar();
        });
      }
    }

    // 16. Isotope Masonry Filter
    if ($.fn.isotope && $(".masonry-grid").length > 0) {
      const $grid = $(".masonry-grid").isotope({
        itemSelector: ".grid-item-main",
        layoutMode: "fitRows",
        transitionDuration: "1200ms",
      });

      $(".portfolio-two__filter-btn").off("click", "button").on("click", "button", function () {
        const filterValue = $(this).attr("data-filter") || "*";
        $grid.isotope({ filter: filterValue === "all" ? "*" : filterValue });
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
      });
    }

    // 17. GSAP Core & Animations Setup
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
      gsap.config({ nullTargetWarn: false, debug: false });

      // Anchor Smooth Scroll
      $('a[href^="#"]').off("click").on("click", function (event) {
        const target = $(this).attr("href");
        if (target && target.length > 1 && $(target).length > 0) {
          event.preventDefault();
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 50 },
            duration: 0.5,
            ease: "power3.inOut",
          });
        }
      });

      // Native Smooth Scroll & ScrollTrigger Refresh
      if (window.imagesLoaded && document.getElementById("smooth-content")) {
        window.imagesLoaded(document.getElementById("smooth-content"), function () {
          ScrollTrigger.refresh();
        });
      }
      setTimeout(() => ScrollTrigger.refresh(), 100);
      setTimeout(() => ScrollTrigger.refresh(), 400);

      // Skill Bar Animation
      $("[data-percent]").each(function () {
        $(this).find(".skill-bar-percent").css("width", $(this).attr("data-percent"));
        $(this).find(".percent-value").text($(this).attr("data-percent"));
      });

      const skillBars = document.querySelectorAll(".skill-bar-single");
      skillBars.forEach((element) => {
        const w = element.querySelector(".skill-bar-percent");
        const p = element.querySelector(".percent-value");
        if (w && p) {
          const target = p.textContent || "0%";
          const tl = gsap.timeline({
            defaults: { duration: 2 },
            scrollTrigger: { trigger: element },
          });
          tl.fromTo(w, { width: 0 }, { width: target });
          tl.from(p, { textContent: "0%", snap: { textContent: 5 } }, "<");
        }
      });

      // Project Horizontal Move
      if ($(".project-sl").length > 0) {
        const sections = gsap.utils.toArray(".project-sl__single");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: ".project-sl",
            pin: true,
            invalidateOnRefresh: true,
            start: "center center",
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + $(".project-sl").innerWidth(),
          },
        });
      }

      // Title Text Split Animation
      if (device_width > 576 && window.SplitText) {
        const titles = gsap.utils.toArray(".title-anim");
        titles.forEach((item) => {
          const split = new SplitText(item, { type: "chars, words", lineThreshold: 0.5 });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "bottom 60%",
              toggleActions: "play none none none",
            },
          });
          tl.from(split.chars, {
            duration: 0.8,
            x: 70,
            autoAlpha: 0,
            stagger: 0.03,
          });
        });
      }

      // Fade In Left Animations
      if (device_width > 576 && $(".fade-left").length > 0) {
        $(".fade-left").each(function () {
          const el = this;
          gsap.set(el, { opacity: 0, x: -70, scale: 0.9 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 100%",
            end: "bottom 20%",
            onEnter: () => gsap.to(el, { opacity: 1, x: 0, scale: 1, duration: 1, stagger: 0.05 }),
            once: true,
          });
        });
      }

      // Fade In Right Animations
      if (device_width > 576 && $(".fade-right").length > 0) {
        $(".fade-right").each(function () {
          const el = this;
          gsap.set(el, { opacity: 0, x: 70, scale: 0.9 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 100%",
            end: "bottom 20%",
            onEnter: () => gsap.to(el, { opacity: 1, x: 0, scale: 1, duration: 1, stagger: 0.05 }),
            once: true,
          });
        });
      }

      // Fade Wrapper Animations
      if (device_width > 576 && $(".fade-wrapper").length > 0) {
        $(".fade-wrapper").each(function () {
          const section = $(this);
          section.find(".fade-top").each(function (index, el) {
            gsap.set(el, { opacity: 0, y: 100, scale: 0.8 });
            ScrollTrigger.create({
              trigger: el,
              start: "top 100%",
              end: "bottom 20%",
              onEnter: () => gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 1, delay: index * 0.05 }),
              once: true,
            });
          });

          section.find(".fade-down").each(function (index, el) {
            gsap.set(el, { opacity: 0, y: -100, scale: 0.8 });
            ScrollTrigger.create({
              trigger: el,
              start: "top 100%",
              end: "bottom 20%",
              onEnter: () => gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 1, delay: index * 0.05 }),
              once: true,
            });
          });
        });
      }

      // Banner 1 Thumb Parallax
      if (device_width > 576 && $(".g-ban-one").length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".banner",
            start: "center center",
            end: "+=100%",
            scrub: true,
          },
        });
        tl.set(".g-ban-one", { y: "-10%" });
        tl.to(".g-ban-one", { opacity: 0, scale: 2, y: "100%", zIndex: -1, duration: 2 });
      }

      // Banner 2 Thumb Parallax
      if (device_width > 576 && $(".banner-two").length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".banner-two",
            start: "center center",
            end: "+=100%",
            scrub: true,
          },
        });
        tl.set(".g-ban-one", { y: "-10%" });
        tl.to(".imae", { opacity: 0, y: "300%", duration: 2 });
      }

      // Banner 4 Thumb Parallax
      if (device_width > 576 && $(".g-ban-four").length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".banner-four",
            start: "center center",
            end: "+=100%",
            scrub: true,
          },
        });
        tl.to(".g-ban-four", {
          opacity: 0,
          scale: 0.3,
          y: "100%",
          x: "30%",
          zIndex: -1,
          duration: 2,
        });
      }

      // Banner 5 Horizontal Move
      if ($(".banner-five").length > 0) {
        const sections = gsap.utils.toArray(".banner-five__single");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: ".banner-five",
            pin: true,
            invalidateOnRefresh: true,
            start: "center center",
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + $(".banner-five").innerWidth(),
          },
        });
      }

      // Modal BG Parallax
      if (device_width > 576 && $(".modal-bg").length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".modal-bg",
            start: "center center",
            end: "+=100%",
            scrub: true,
          },
        });
        tl.to(".modal-bg", { opacity: 0, scale: 1, y: "50%", duration: 2 });
      }

      // Testimonial Two Parallax
      if (device_width > 576 && $(".testimonial-g-con").length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".testimonial-two",
            start: "center center",
            end: "+=100%",
            scrub: true,
          },
        });
        tl.to(".testimonial-g-con", { opacity: 0, scale: 1, y: "-100%", duration: 1 });
      }

      // Folks Text Animation
      if (device_width > 576 && $(".folks-text").length > 0 && window.chroma) {
        const folksBD = gsap.timeline({
          repeat: -1,
          delay: 0.5,
          scrollTrigger: {
            trigger: ".folks-text",
            start: "bottom 100%-=50px",
          },
        });
        gsap.set(".folks-text", { opacity: 0 });
        gsap.to(".folks-text", {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".folks-text",
            start: "bottom 100%-=50px",
            once: true,
          },
        });
        const mySplitText = new SplitText(".folks-text", { type: "words,chars,capitalize" });
        const chars = mySplitText.chars;
        const folksGradient = chroma.scale(["#ff7425", "#ffffff"]);
        folksBD.to(chars, {
          duration: 0.5,
          scaleY: 0.6,
          ease: "power3.out",
          stagger: 0.04,
          transformOrigin: "center bottom",
        });
        folksBD.to(chars, { yPercent: -20, ease: "elastic", stagger: 0.03, duration: 0.8 }, 0.5);
        folksBD.to(chars, { scaleY: 1, ease: "elastic.out(2.5, 0.2)", stagger: 0.03, duration: 1.5 }, 0.5);
        folksBD.to(chars, { color: (i, el, arr) => folksGradient(i / arr.length).hex(), ease: "power2.out", stagger: 0.03, duration: 0.3 }, 0.5);
        folksBD.to(chars, { yPercent: 0, ease: "back", stagger: 0.03, duration: 0.8 }, 0.7);
        folksBD.to(chars, { color: "#ffffff", duration: 1.4, stagger: 0.05 });
      }
    }
  }

  // Hook into Astro View Transitions lifecycle
  document.addEventListener("astro:page-load", initApp);
  document.addEventListener("astro:before-swap", cleanupApp);

  // Fallback for initial standard load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
