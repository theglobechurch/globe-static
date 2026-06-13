import dayjs from "dayjs";

export const shortcodes = {
  svgIcon: function (name, cls = null, title = "") {
    if (title !== "") {
      title = `<title>${title}</title>`;
    }
    return `<svg class="${cls}">${title}<use xlink:href="/_assets/svgSprite.svg#svg-${name}"></use></svg>`;
  },

  mapUrl: function (address) {
    if (!address) { return null }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  },

  dateRange: function (startDate, endDate) {

    const my = 'MMMM YYYY';
    const y = 'YYYY';

    startDate = dayjs(startDate);
    if (endDate) {
      endDate = dayjs(endDate);
    } else {
      endDate = startDate;
    }

    if (startDate.format(my) === endDate.format(my)) {
      return startDate.format(my);
    }

    if (startDate.format(y) === endDate.format(y)) {
      return `${startDate.format('MMMM')} – ${endDate.format(my)}`;
    }

    return `${startDate.format(my)} – ${endDate.format(my)}`;
  }
}
