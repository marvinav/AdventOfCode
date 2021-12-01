# Requirement

1. [Install deno](https://deno.land/).

2. Get session cookie:
   - Open in Browser [login page](https://adventofcode.com/2021/auth/login) and login with preferred way;
   - Open *Developer Tools* (default `F12`) -> Application -> Cookies
   - Copy value of *session* cookie and past in `.env`

3. Run quiz day
    ```sh
    $HOME/.deno/bin/deno run --allow-read --allow-net 1-day.ts
    ```

