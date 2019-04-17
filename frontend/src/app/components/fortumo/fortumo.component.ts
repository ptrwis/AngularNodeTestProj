import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'fortumo',
  template: `
  <div class="content__text markdown">
    <h1 id="web-sdk">Web SDK</h1>
    <!-- e2bbf830a55f565375915a94f3309cc -->
    <a  id="fmp-button" 
        href="http://pay.fortumo.com/mobile_payments/"
        rel="1c0815802769121dbd99975156465bd2?test=ok&amp;1" >
        <img  src="https://assets.fortumo.com/fmp/fortumopay_150x50_red.png" 
              width="150" height="50" alt="Mobile Payments by Fortumo" border="0" />
    </a>
    <script src="https://assets.fortumo.com/fmp/fortumopay.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
    <script src="https://assets.fortumo.com/fmp/fmp_loader.js" type="text/javascript"></script>
  </div>
  `,
})
export class FortumoComponent {

}
