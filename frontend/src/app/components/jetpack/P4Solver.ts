/**
 * ax^4 + bx^3 + cx^2 + dx + e = 0
 * https://en.wikipedia.org/wiki/Quartic_function
 */
export interface Polynomial4 {
      a: number
      b: number
      c: number
      d: number
      e: number
}

export function solveP4(params: Polynomial4) {
      const a = params.a;
      const b = params.b;
      const c = params.c;
      const d = params.d;
      const e = params.e;
      /* const Δ = 
            256*(a**3)*(e**3) - 192*(a**2)*b*d*(e**2) - 128*(a**2)*(c**2)*(e**2) + 144*(a**2)*c*(d**2)*e - 27*(a**2)*(d**4)
            + 144*a*(b**2)*c*(e**2) - 6*a*(b**2)*(d**2)*e - 80*a*b*(c**2)*d*e + 18*a*b*c*(d**3) + 16*a*(c**4)*e
            - 4*a*(c**3)*(d**2) - 27*(b**4)*(e**2) + 18*(b**3)*c*d*e - 4*(b**3)*(d**3) - 4*(b**2)*(c**3)*e + (b**2)*(c**2)*(d**2); */
      // const P = 8*a*c - 3*(b**2)
      // const R = (b**3) + 8*d*(a**2) - 4*a*b*c;
      const Δ0 = c ** 2 - 3 * b * d + 12 * a * e;
      const Δ1 = 2 * (c ** 3) - 9 * b * c * d + 27 * (b ** 2) * e + 27 * a * (d ** 2) - 72 * a * c * e;
      // const D = 64*(a**3)*e - 16*(a**2)*(c**2) + 16*a*(b**2)*c - 16*(a**2)*b*d - 3*(b**4);
      const p = (8 * a * c - 3 * (b ** 2)) / (8 * a ** 2);
      const q = (b ** 3 - 4 * a * b * c + 8 * (a ** 2) * d) / (8 * a ** 3);
      const Q = ((Δ1 + (Δ1 ** 2 - 4 * Δ0 ** 3) ** 0.5) / 2) ** (1 / 3);
      const S = 0.5 * (-(2 / 3) * p + (1 / (3 * a)) * (Q + Δ0 / Q)) ** 0.5;
      // ---------
      const x1 = -b / (4 * a) - S + 0.5 * (-4 * S ** 2 - 2 * p + q / S) ** 0.5
      const x2 = -b / (4 * a) - S - 0.5 * (-4 * S ** 2 - 2 * p + q / S) ** 0.5
      const x3 = -b / (4 * a) + S + 0.5 * (-4 * S ** 2 - 2 * p - q / S) ** 0.5
      const x4 = -b / (4 * a) + S - 0.5 * (-4 * S ** 2 - 2 * p - q / S) ** 0.5
      return [x1, x2, x3, x4];
}
