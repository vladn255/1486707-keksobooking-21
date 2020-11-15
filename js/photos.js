'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const adFormAvatarInput = document.querySelector(`.ad-form-header__input`);
const adFormHeaderPreview = document.querySelector(`.ad-form-header__preview`)
  .querySelector(`img`);
const adFormHousingInput = document.querySelector(`.ad-form__input`);
const adFormPhotoPreview = document.querySelector(`.ad-form__photo`);

// установщик картинки превью
const changePreview = (inputElement, previewElement) => {
  const file = inputElement.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, () => {
      if (previewElement.tagName.toLowerCase() !== `img`) {
        previewElement.style.backgroundImage = `url(${reader.result})`;
        previewElement.style.backgroundRepeat = `round`;
      }
      previewElement.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
};

// обработчик загрузки аватарки
const onAvatarUpload = () => {
  changePreview(adFormAvatarInput, adFormHeaderPreview);
};

// обработчик загрузки картинки жилья
const onHousingUpload = () => {
  changePreview(adFormHousingInput, adFormPhotoPreview);
};

adFormAvatarInput.addEventListener(`change`, onAvatarUpload);
adFormHousingInput.addEventListener(`change`, onHousingUpload);
