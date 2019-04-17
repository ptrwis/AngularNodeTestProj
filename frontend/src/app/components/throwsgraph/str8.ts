/**
 * (xa, ya) - (xb - yb)
 * x = xa + t * (xb - xa)
 * y = ya + t * (yb - ya)
 * 
 * maxima:
 * 
solve(
    M^2
    =
    (
        (
            (
                xa + t * (xb - xa)
            )
            -
            (
                x1 + v1*cosb*(t-t1)
            )
        )^2
        +
        (
            (
                ya + t * (yb - ya)
            )
            -
            (
                y1 + v1*sin*(t-t1) - 0.5*g*(t-t1)^2
            )
        )^2
    )
,
    [t]
);

*/

export class Str8 {
}
/*

xa = A
xb = B

ya = C
yb = D

sinb = H
cosb = F

v1 = V
t1 = T
x1 = X
y1 = Y

t = j

V*F = L
V*H = K
B_A = N

M^2 = 
(
    ( ( A + j* (B - A) ) - ( X + L*(j-T) ) )^2
    +
    ( ( C + j * (D - C) ) - ( Y + K*(j-T) - 0.5*g*(j-T)^2 ) )^2
)

*/