const local = false;

// THIS VARIABLES JUST FOR TEST 😁

let base: string;
let category: string;

if (local) {
  // type here links related real server
} else {
  // type here links related to local serve
}
base = 'http://localhost/aphamea_project/web/index.php';
category = 'http://localhost/aphamea_project/web/index.php/category';

export const environment = {
  production: false,
  base,
};
