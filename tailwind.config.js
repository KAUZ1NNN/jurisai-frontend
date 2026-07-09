export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT:'#C8A84B', light:'#FAEEDA', muted:'rgba(200,168,75,0.1)', border:'rgba(200,168,75,0.25)' },
        navy: { DEFAULT:'#081724', light:'#0D2035' },
      },
      fontFamily: { sans:['Inter','system-ui','sans-serif'] },
    },
  },
  plugins: [],
}
