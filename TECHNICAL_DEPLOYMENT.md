# CFP02 trainee rules update

## Local installation

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

The official multilingual rules PDF must remain at:

`public/CFP02_Reglement_Interieur_Traductions.pdf`

The application extracts the detailed official translations from that PDF when the rules page loads. The language selector is available on the rules and rules-acceptance screens.

## Deployment

Deploy the generated `.output/` directory using the hosting configuration used by this TanStack Start project. Keep the PDF in the public assets so the browser can load it at `/CFP02_Reglement_Interieur_Traductions.pdf`.
