// jshint esversion:6

const datelog = () => {
  const date = new Date();
  const getday = date.getDay();

  // date method to get the day of the week cleanly
  let options = {
    weekday: `long`,
    day: `numeric`,
    month: `long`,
  };

  return (day = date.toLocaleDateString("en-US", options));
};

module.exports = datelog;
