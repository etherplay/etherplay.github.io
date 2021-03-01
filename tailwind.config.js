module.exports = {
  purge: ['./src/**/*.html', './src/**/*.svelte'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {

    },
    backgroundImage: () => ({
      'ingame': "url('../images/Ingame1.jpg')",
     })
  },
  variants: {},
  plugins: [],
};
