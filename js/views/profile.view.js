class ProfileView {
  render(user) {
    if (!user) return;

    const fullName = document.getElementById("profileFullName");
    const shortName = document.getElementById("profileShortName");
    const lastName = document.getElementById("profileLastName");
    const email = document.getElementById("profileEmail");
    const emailCard = document.getElementById("profileEmailCard");
    const gender = document.getElementById("profileGender");
    const birthDate = document.getElementById("profileBirthDate");

    if (fullName) {
      fullName.textContent = `${user.firstName} ${user.lastName}`;
    }

    if (shortName) {
      shortName.textContent = user.firstName;
    }

    if (lastName) {
      lastName.textContent = user.lastName;
    }

    if (email) {
      email.textContent = user.email;
    }

    if (emailCard) {
      emailCard.textContent = user.email;
    }

    if (gender) {
      gender.textContent = user.gender || "—";
    }

    if (birthDate) {
      birthDate.textContent = user.birthDate || "—";
    }
  }

  bindLogout(handler) {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", handler);
  }

  redirect(url) {
    window.location.href = url;
  }
}

window.ProfileView = ProfileView;