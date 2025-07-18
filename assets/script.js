$(document).ready(function () {
  console.log("Jquery Ready!");
  const API = {
    referral:
      "https://script.google.com/macros/s/AKfycbynolM1a-p9gRnYd1nxNfRIuBWkt6uGJWIaRsj01p9iaYM7xCUkAlKqIemsT8OA2KLJ/exec",
  };

  function triggerPayment(type) {
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LdbZIYrAAAAABoezfmGM_GtrP5Rh-OFCeBXxPea", {
          action: "bayarsekarang",
        })
        .then(function (token) {
          if (type == "getBasePrice") {
            getBasePrice(token);
          } else if (type == "check") {
            checkCodeReferral(token);
          } else if (type == "pay") {
            submitFormBuy(token);
          }
        });
    });
  }

  function formatRupiah(value) {
    return "Rp" + value.toLocaleString("id-ID");
  }

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const dev = getQueryParam("dev");
  let devMode;
  if (dev == null) {
    devMode = "";
  } else {
    devMode = `&dev=${encodeURIComponent(dev)}`;
  }

  getBasePrice();

  function getBasePrice() {
    $.getJSON(`${API.referral}?type=getBasePrice${devMode}`)
      .done(function (data) {
        if (data.status == "error") {
          $(".form-buy-area").attr("style", "text-align: center");
          $(".form-buy-area").text(data.message);
        } else {
          $(".form-buy-area").html(`
  <small>Beli ebook:</small>
  <p style="margin-top: 10px; margin-bottom: 40px">
    <b
      >$25K dalam 14 Hari:<br />
      Strategi & Mindset Bug Bounty di Company Raksasa Dunia</b
    >
  </p>
  <h3>Data Pembeli</h3>
  <div class="input-group flex-nowrap" style="margin-top: 30px">
    <input
      type="text"
      id="inputName"
      class="form-control input-custom"
      style="width: 100%"
      maxlength="30"
      placeholder="🙍🏻‍♂️ Nama Lengkap"
    />
  </div>
  <div class="input-group flex-nowrap" style="margin-top: 10px">
    <input
      type="email"
      id="inputEmail"
      class="form-control input-custom"
      style="width: 100%"
      maxlength="30"
      placeholder="＠ Email (wajib @gmail.com)"
    />
    <p
      style="
        line-height: 15px;
        font-size: 12px;
        margin-bottom: 0;
        margin-top: 9px;
      "
    >
      *Pastikan email <b>@gmail.com</b> dan masih aktif, karena akses ke
      ebook memerlukan email tersebut.
    </p>
  </div>
  <div class="input-group flex-nowrap" style="margin-top: 20px">
    <small>Punya kode referral?</small><br />
    <input
      type="text"
      class="form-control input-custom"
      placeholder="🎫 Kode Referral"
      maxlength="30"
      style="
        margin-top: 10px;
        margin-bottom: 10px;
        text-transform: uppercase;
      "
      id="referralCodeInput"
    />
    <button
      class="button buy-button w-button useReferralCode"
      type="button"
      id="useReferralCode"
    >
      Gunakan
    </button>
  </div>
  <small style="color: red" id="messageCheckReferral"></small>
  <div class="detail-pricing">
    <div class="item-pricing">
      <small>Harga Ebook</small>
      <small id="price-item-ebook"
        ><i class="fa fa-spinner fa-spin"></i
      ></small>
    </div>
    <div class="item-pricing">
      <small>Biaya Layanan</small>
      <small id="price-services"
        ><i class="fa fa-spinner fa-spin"></i
      ></small>
    </div>
    <div class="item-pricing" style="margin-top: 10px">
      <small>Total Biaya</small>
      <small id="total-price-item"
        ><i class="fa fa-spinner fa-spin"></i
      ></small>
    </div>
    <div class="item-pricing" style="margin-top: 20px">
      <small id="errorValidation"></small>
    </div>
  </div>
  <div class="input-group flex-nowrap" style="margin-top: 30px">
    <button
      class="button buy-button pay-now w-button submitFormBuy"
      type="button"
      id="submitFormBuy"
      style="width: 100%"
    >
      BAYAR SEKARANG
    </button>
  </div>
  <div style="text-align: center; margin-top: 10px; font-size: 16px">
    <small
      ><i class="bi bi-shield-check"></i> Garansi Pembayaran Aman</small
    >
  </div>
  <div
    class="email-official-area"
    style="
      text-align: center;
      margin-top: 60px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 20px;
      padding: 20px;
    "
  >
    Email resmi kami hanya <br />
    <b style="color: chartreuse">services.bookhunter@gmail.com</b>
    <br />
    <b style="color: chartreuse">services2.bookhunter@gmail.com</b>
    <br />
    <b style="color: chartreuse">services3.bookhunter@gmail.com</b>
  </div>
            `);
          $("#price-item-ebook").text(formatRupiah(parseInt(data.basePrice)));
          $("#price-item-ebook").attr("price-value", parseInt(data.basePrice));
          $("#price-services").text(formatRupiah(parseInt(2000)));
          $("#total-price-item").text(
            formatRupiah(parseInt(data.basePrice) + 2000)
          );
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        $(".form-buy-area").attr("style", "text-align: center");
        $(".form-buy-area").text("Terjadi kesalahan");
      });
  }

  $(document).on("click", "#useReferralCode", function () {
    let referralCode = $("#referralCodeInput").val();
    if (referralCode != "") {
      $("#useReferralCode").html(`
          <i class="fa fa-spinner fa-spin"></i>
      `);
      triggerPayment("check");
    }
  });

  function checkCodeReferral(captchaToken) {
    $(".useReferralCode").removeAttr("id");
    let referralCode = $("#referralCodeInput").val();
    $.getJSON(
      `${API.referral}?type=check&code=${encodeURIComponent(
        referralCode
      )}&captcha=${captchaToken}`
    )
      .done(function (data) {
        $(".useReferralCode").attr("id", "useReferralCode");
        $("#useReferralCode").text(`
          Gunakan
          `);
        if (data.status == "ok") {
          $("#price-item-ebook").html(
            `<strike>${formatRupiah(
              parseInt(data.basePrice)
            )}</strike> <br> ${formatRupiah(parseInt(data.finalAmount))}`
          );
          $("#total-price-item").html(
            `${formatRupiah(parseInt(data.finalAmount) + 2000)}`
          );
          $("#messageCheckReferral").text("");
        } else {
          $("#messageCheckReferral").text("Kode tidak ditemukan");
          let basePrice = $("#price-item-ebook").attr("price-value");
          $("#price-item-ebook").text(`${formatRupiah(parseInt(basePrice))}`);
          $("#total-price-item").text(
            `${formatRupiah(parseInt(basePrice) + 2000)}`
          );
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        $(".useReferralCode").attr("id", "useReferralCode");
        $("#messageCheckReferral").text("Terjadi kesalahan");
        $("#useReferralCode").text(`
          Gunakan
          `);
      });
  }

  $(document).on("click", "#submitFormBuy", function (e) {
    const name = $("#inputName").val().trim();
    const email = $("#inputEmail").val().trim();
    if (name != "" && email != "") {
      triggerPayment("pay");
    }
  });

  function submitFormBuy(captchaToken) {
    const name = $("#inputName").val().trim();
    const email = $("#inputEmail").val().trim();
    const code = $("#referralCodeInput").val().trim();
    const query = `?type=pay&name=${encodeURIComponent(
      name
    )}&email=${encodeURIComponent(email)}&code=${encodeURIComponent(
      code
    )}&captcha=${captchaToken}${devMode}`;
    let errors = [];
    if (!name || !/^[A-Za-z\s]+$/.test(name) || name.length > 30) {
      errors.push(
        "Nama hanya boleh berisi huruf dan spasi, maksimal 30 karakter."
      );
    }
    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !email.toLowerCase().endsWith("@gmail.com")
    ) {
      errors.push(
        "Email harus menggunakan format yang valid dan berakhiran @gmail.com."
      );
    }
    if (code && (!/^[a-zA-Z0-9]+$/.test(code) || code.length > 20)) {
      errors.push(
        "Kode referral hanya boleh huruf dan angka, maksimal 20 karakter."
      );
    }
    if (errors.length > 0) {
      $("#errorValidation").html(
        errors.map((err) => `<div>• ${err}</div>`).join("")
      );
    } else {
      $("#submitFormBuy").html(`
          <i class="fa fa-spinner fa-spin"></i>
      `);
      $(".submitFormBuy").removeAttr("id");
      $("#errorValidation").html("");
      $.getJSON(API.referral + query)
        .done(function (data) {
          if (data.status === "ok") {
            $("#errorValidation").text("");
            $(".submitFormBuy").html(`
              TUNGGU DALAM <span id="countdown">3</span> DETIK..
          `);
            let count = 3;
            let el = document.getElementById("countdown");
            let timer = setInterval(function () {
              count--;
              if (count > 0) {
                el.textContent = count;
              } else {
                clearInterval(timer);
                window.location.href = data.snapUrl;
              }
            }, 1000);
          } else {
            $("#errorValidation").html(data.errors.join("<br>"));
            $(".submitFormBuy").attr("id", "submitFormBuy");
            $("#submitFormBuy").text(`
              BAYAR SEKARANG
          `);
          }
        })
        .fail(function () {
          $(".submitFormBuy").attr("id", "submitFormBuy");
          alert("Terjadi kesalahan.");
          $("#submitFormBuy").text(`
              BAYAR SEKARANG
          `);
        });
    }
  }
});
