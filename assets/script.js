$(document).ready(function () {
  console.log("Jquery Ready!");
  const API = {
    referral:
      "https://script.google.com/macros/s/AKfycbynolM1a-p9gRnYd1nxNfRIuBWkt6uGJWIaRsj01p9iaYM7xCUkAlKqIemsT8OA2KLJ/exec",
  };

  function formatRupiah(value) {
    return "Rp" + value.toLocaleString("id-ID");
  }

  $.getJSON(`${API.referral}?type=getBasePrice`)
    .done(function (data) {
      $("#price-item-ebook").text(formatRupiah(parseInt(data.basePrice)));
      $("#price-services").text(formatRupiah(parseInt(2000)));
      $("#total-price-item").text(
        formatRupiah(parseInt(data.basePrice) + 2000)
      );
    })
    .fail(function (jqxhr, textStatus, error) {
      $("#messageCheckReferral").text("Terjadi kesalahan");
    });

  $(document).on("click", "#useReferralCode", function () {
    let referralCode = $("#referralCodeInput").val();
    if (referralCode != "") {
      $(this).html(`
            <i class="fa fa-spinner fa-spin"></i>
        `);
      $.getJSON(`${API.referral}?type=check&code=${referralCode}`)
        .done(function (data) {
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
            $("#price-item-ebook").html(
              `${formatRupiah(parseInt(data.finalAmount))}`
            );
            $("#total-price-item").html(
              `${formatRupiah(parseInt(data.finalAmount) + 2000)}`
            );
          }
        })
        .fail(function (jqxhr, textStatus, error) {
          $("#messageCheckReferral").text("Terjadi kesalahan");
          $("#useReferralCode").text(`
            Gunakan
            `);
        });
    }
  });

  $(document).on("click", "#submitFormBuy", function () {
    const name = $("#inputName").val().trim();
    const email = $("#inputEmail").val().trim();
    const code = $("#referralCodeInput").val().trim();
    const query = `?type=pay&name=${encodeURIComponent(
      name
    )}&email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;
    if (name != "" && email != "") {
      $(this).html(`
        <i class="fa fa-spinner fa-spin"></i>
    `);
      $.getJSON(API.referral + query)
        .done(function (data) {
          if (data.status === "ok") {
            $("#errorValidation").text("");
            $("#submitFormBuy").html(`
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
            $("#submitFormBuy").text(`
                BAYAR SEKARANG
            `);
          }
        })
        .fail(function () {
          alert("Terjadi kesalahan saat memeriksa data.");
        });
    }
  });
});
