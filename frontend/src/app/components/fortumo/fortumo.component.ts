import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'fortumo',
  template: `
  <script src="https://assets.fortumo.com/fmp/fortumopay.js" type="text/javascript"></script>
  <h3>Fortumo</h3>
  <br />
  <a id="fmp-button" href="#" rel="YOUR SERVICE ID HERE/userId123">
    <img src="https://assets.fortumo.com/fmp/fortumopay_150x50_red.png" width="150" height="50" alt="Mobile Payments by Fortumo" border="0" />
  </a>
  <br />
  <a href="#" id=fmp-button rel="1c0815802769121dbd99975156465bd2?test=ok&amp;1" class="btn btn--secondary">Try Demo Payment</a>
  `,
})
export class FortumoComponent {

}
