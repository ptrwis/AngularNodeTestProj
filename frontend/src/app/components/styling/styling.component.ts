import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
/**
 * https://fonts.google.com/
 * <style>
 * @import url('https://fonts.googleapis.com/css?family=Tangerine');
 * </style>
 * <link href="https://fonts.googleapis.com/css?family=Tangerine" rel="stylesheet">
 * font Tangerine
 * 
 */
@Component({
  selector: 'styling',
  template: `
  <div style="width: 100%; height: 100%; 
       background-color: black;
       background-image: radial-gradient(circle at top right,    #550000 1%, transparent 70%),
                         
                         radial-gradient(circle at top left,     #000055 1%, transparent 70%);" >
    <span style="font-family: 'Tangerine', cursive; 
                 font-size: 80px;
                 color: white;
                 background-color: black;
                 text-shadow: 0px 0px 8px red,
                              0px 0px 16px red,
                              0px 0px 24px red,
                              0px 0px 32px red " >
      Cafe Luna
    </span>
    <br />
    
    <!-- https://www.flaticon.com/ -->
    <div style="display: flex; flex-direction: column;" >
      <div style="display: flex; flex-direction: row; justify-content: space-around; " >
        <div>
          <!-- person -->
          <svg xmlns="http://www.w3.org/2000/svg" height="64px" width="64px" viewBox="-24 1 511 511.99925" >
            <path d="m5.355469 240.355469 36.632812 22.414062c6.554688 4.011719 14.738281-.960937 14.738281-8.910156v-4.207031h67.148438c10.039062 0 18.207031-8.167969 18.207031-18.210938 0-10.039062-8.167969-18.207031-18.207031-18.207031h-67.148438v-4.207031c0-7.972656-8.199218-12.914063-14.738281-8.910156l-36.632812 22.414062c-6.472657 3.960938-6.476563 13.855469 0 17.824219zm36.371093-22.492188v2.871094c0 4.144531 3.355469 7.5 7.5 7.5h74.648438c1.769531 0 3.207031 1.441406 3.207031 3.207031 0 1.769532-1.4375 3.210938-3.207031 3.210938h-74.648438c-4.144531 0-7.5 3.355468-7.5 7.5v2.871094l-22.191406-13.582032zm0 0" fill="#FFDA44"/><path d="m421.902344 200.117188c-6.539063-4.003907-14.742188.941406-14.742188 8.910156v4.207031h-67.144531c-10.042969 0-18.210937 8.167969-18.210937 18.207031 0 10.042969 8.167968 18.210938 18.210937 18.210938h67.144531v4.207031c0 7.964844 8.199219 12.914063 14.742188 8.910156l36.632812-22.414062c6.472656-3.964844 6.476563-13.859375-.003906-17.824219zm.261718 44.90625v-2.875c0-4.140626-3.359374-7.5-7.5-7.5h-74.648437c-1.769531 0-3.210937-1.4375-3.210937-3.207032 0-1.769531 1.441406-3.207031 3.210937-3.207031h74.648437c4.140626 0 7.5-3.359375 7.5-7.5v-2.871094l22.191407 13.578125zm0 0" fill="#FFDA44"/><path d="m295.484375 167.902344c7.117187 7.113281 18.636719 7.117187 25.753906 0l47.480469-47.480469 2.976562 2.976563c5.632813 5.628906 14.925782 3.328124 16.722657-4.125l10.050781-41.75c1.777344-7.375-5.214844-14.382813-12.601562-12.605469l-41.753907 10.050781c-7.453125 1.796875-9.753906 11.089844-4.121093 16.722656l2.976562 2.976563-47.480469 47.480469c-7.117187 7.117187-7.117187 18.636718-.003906 25.753906zm10.609375-15.144532 52.785156-52.785156c2.925782-2.925781 2.929688-7.675781 0-10.605468l-2.03125-2.03125 25.292969-6.089844-6.085937 25.296875-2.03125-2.03125c-2.929688-2.929688-7.679688-2.929688-10.609376 0l-52.785156 52.78125c-1.25 1.253906-3.28125 1.253906-4.535156 0-1.253906-1.25-1.253906-3.285157 0-4.535157zm0 0" fill="#FFDA44"/><path d="m119.777344 74.972656-41.753906-10.054687c-7.375-1.773438-14.378907 5.214843-12.601563 12.605469l10.050781 41.75c1.796875 7.457031 11.089844 9.753906 16.722656 4.121093l2.976563-2.972656 47.480469 47.480469c7.097656 7.097656 18.652344 7.097656 25.753906 0 7.097656-7.101563 7.097656-18.652344 0-25.75l-47.484375-47.480469 2.976563-2.976563c5.632812-5.632812 3.332031-14.929687-4.121094-16.722656zm38.019531 77.785156c1.25 1.25 1.25 3.285157 0 4.535157-1.253906 1.25-3.285156 1.25-4.535156 0l-52.785157-52.785157c-2.929687-2.925781-7.675781-2.925781-10.609374 0l-2.027344 2.03125-6.089844-25.292968 25.292969 6.089844-2.03125 2.03125c-2.929688 2.929687-2.929688 7.679687 0 10.605468zm0 0" fill="#FFDA44"/><path d="m185.496094 351.28125c-66.34375 25.722656-61.503906 23.789062-63.273438 24.664062-6.96875 3.453126-31.226562 17.792969-31.226562 50.132813v65.484375c0 11.265625 9.164062 20.4375 20.4375 20.4375h103.664062c4.144532 0 7.503906-3.359375 7.503906-7.5 0-4.144531-3.359374-7.5-7.503906-7.5h-60.789062v-59.796875c0-4.144531-3.359375-7.5-7.5-7.5-4.144532 0-7.5 3.355469-7.5 7.5v59.796875h-27.875c-2.996094 0-5.4375-2.4375-5.4375-5.4375v-65.484375c0-17.285156 11.046875-31.625 23.695312-37.074219 7.3125-2.835937 50.113282-19.425781 56.511719-21.910156l4.234375 4.5c22.8125 24.238281 60.207031 24.230469 83.011719 0l4.566406-4.851562c6.496094 2.511718 52.132813 20.1875 57.492187 22.261718 1.160157.503906 23.691407 10.617188 23.691407 37.074219v65.484375c0 2.996094-2.4375 5.4375-5.433594 5.4375h-27.875v-59.796875c0-4.144531-3.355469-7.5-7.5-7.5s-7.5 3.355469-7.5 7.5v59.796875h-60.789063c-4.144531 0-7.5 3.355469-7.5 7.5 0 4.140625 3.355469 7.5 7.5 7.5h103.667969c11.269531 0 20.433594-9.167969 20.433594-20.4375v-65.484375c0-32.339844-24.257813-46.679687-31.226563-50.132813-1.960937-.96875 4.910157 1.765626-73.90625-28.757812v-15.4375c11.289063-8.996094 19.199219-22.058594 21.457032-36.957031 14.3125-1.578125 24.632812-13.390625 24.632812-27.207031 0-6.425782-2.253906-12.574219-6.289062-17.429688v-22.046875c0-42.417969-34.507813-76.929687-76.925782-76.929687-42.417968 0-76.929687 34.511718-76.929687 76.929687v22.628906c-4.078125 4.796875-6.285156 10.648438-6.285156 16.847657 0 13.742187 10.25 25.648437 24.679687 27.210937 2.285156 14.523437 10.148438 28.484375 22.636719 37.890625v14.503906zm105.695312-71.855469v-23.679687c5.300782 1.554687 8.96875 6.308594 8.96875 11.839844 0 5.445312-3.550781 10.253906-8.96875 11.839843zm-121.175781-51.316406c0-34.148437 27.78125-61.929687 61.929687-61.929687 34.144532 0 61.925782 27.78125 61.925782 61.929687v12.824219c-.882813-.207032-1.777344-.367188-2.6875-.488282-.101563-3.648437-1.574219-5.621093-4.675782-9.125-1.960937-2.226562-8.902343-9.574218-14.878906-15.996093-4.085937-4.394531-10.683594-5.148438-15.640625-1.910157-17.863281 11.667969-39.058593 18.375-59.523437 19.066407-10.382813.351562-14.625-1.773438-19.84375 3.054687-1.515625 1.40625-2.683594 3.3125-3.273438 5.066406-1.054687.152344-2.53125.476563-3.332031.6875zm-6.28125 39.476563c0-5.242188 3.9375-9.585938 8.96875-11.40625v23.246093c-5.472656-1.597656-8.96875-6.449219-8.96875-11.839843zm23.96875 18.398437c0-20.136719 0-18.308594 0-38.539063 25.234375 1.132813 52.105469-6.140624 74.519531-20.210937 7.605469 8.15625 12.230469 13 13.96875 15.03125 0 50.996094.003906 42.789063-.015625 44.273437-.773437 25.472657-21.007812 42.949219-43.492187 42.949219-26.488282 0-44.980469-20.40625-44.980469-43.503906zm66.367187 54.457031v7.152344c0 5.777344 3.546876 11.066406 8.859376 13.289062-17.808594 18.914063-44.972657 18.007813-61.632813.359376 6.292969-2.4375 9.753906-8.09375 9.753906-13.898438v-6.539062c13.0625 4.726562 28.855469 5.210937 43.019531-.363282zm0 0" fill="#FFDA44"/><path d="m235.152344 48.726562v22.0625c0 4.144532 3.355468 7.5 7.5 7.5 4.144531 0 7.5-3.355468 7.5-7.5v-14.5625h4.207031c7.972656 0 12.914063-8.203124 8.914063-14.738281l-22.417969-36.628906c-3.957031-6.472656-13.855469-6.484375-17.824219-.003906l-22.414062 36.632812c-4.003907 6.542969.953124 14.738281 8.910156 14.738281h4.207031v67.148438c0 10.039062 8.171875 18.207031 18.210937 18.207031 10.039063 0 18.207032-8.167969 18.207032-18.207031v-17.582031c0-4.140625-3.355469-7.5-7.5-7.5-4.144532 0-7.5 3.359375-7.5 7.5v17.582031c0 1.769531-1.4375 3.207031-3.207032 3.207031-1.769531 0-3.207031-1.4375-3.207031-3.207031v-74.648438c0-4.144531-3.359375-7.5-7.5-7.5h-2.875l13.582031-22.195312 13.578126 22.195312h-2.871094c-4.144532 0-7.5 3.355469-7.5 7.5zm0 0" fill="#FFDA44"/>
          </svg>
        </div>
        <div>
          <!-- rocket -->
          <svg xmlns="http://www.w3.org/2000/svg" height="64px" width="64px" viewBox="-62 1 511 511.99962" >
            <path d="m382.289062 306.34375-69.890624-84.195312v-10.601563c0-41.058594-9.441407-80.390625-28.070313-116.910156-17.046875-33.421875-42.335937-64.726563-74.878906-89.417969-9.175781-6.957031-22.070313-6.960938-31.242188 0-30.167969 22.886719-56.308593 53.003906-74.882812 89.417969-18.628907 36.519531-28.070313 75.851562-28.070313 116.910156v10.601563l-69.890625 84.195312c-3.136719 3.773438-4.863281 8.5625-4.863281 13.472656v57.101563c0 11.628906 9.460938 21.089843 21.089844 21.089843h54.777344c3.222656 10.621094 13.101562 18.375 24.761718 18.375h28.390625v14.25c-7.332031 2.679688-12.589843 9.703126-12.589843 17.949219v7.746094c0 10.542969 8.578124 19.121094 19.121093 19.121094h40.277344c4.140625 0 7.5-3.355469 7.5-7.5s-3.359375-7.5-7.5-7.5h-40.277344c-2.234375 0-4.117187-1.886719-4.117187-4.121094v-7.746094c0-2.230469 1.882812-4.117187 4.117187-4.117187h115.550781c2.234376 0 4.121094 1.886718 4.121094 4.117187v7.746094c0 2.234375-1.886718 4.121094-4.121094 4.121094h-40.273437c-4.144531 0-7.5 3.355469-7.5 7.5s3.355469 7.5 7.5 7.5h40.273437c10.542969 0 19.121094-8.578125 19.121094-19.121094v-7.746094c0-8.246093-5.257812-15.269531-12.585937-17.945312v-14.253907h28.386719c11.660156 0 21.539062-7.753906 24.765624-18.375h54.773438c11.628906 0 21.09375-9.460937 21.09375-21.089843 0-6.417969 0-50.046875 0-57.101563-.003906-4.910156-1.730469-9.695312-4.867188-13.472656.003907 0 .003907 0 0 0zm-11.539062 9.582031c.902344 1.089844 1.402344 2.472657 1.402344 3.890625v34.070313h-59.753906v-108.253907zm-183.476562-298.753906c3.53125-2.679687 8.5-2.964844 12.367187-.515625 1.480469.941406 28.03125 20.125 51.210937 52.050781h-114.050781c14.238281-19.609375 31.238281-36.941406 50.472657-51.535156zm-97.019532 194.375c0-46.046875 12.742188-89.964844 36.246094-127.839844h134.652344c23.503906 37.875 36.246094 81.792969 36.246094 127.839844v13.308594 148.445312h-80.5c0-22.972656 0-25.894531 0-48.117187 0-4.144532-3.355469-7.5-7.5-7.5-4.144532 0-7.5 3.355468-7.5 7.5v28.707031h-16.144532v-98.160156c0-2.6875 2.269532-4.957031 4.957032-4.957031h6.230468c2.6875 0 4.957032 2.269531 4.957032 4.957031v34.445312c0 4.144531 3.355468 7.503907 7.5 7.503907 4.144531 0 7.5-3.359376 7.5-7.503907v-34.445312c0-11.003907-8.953126-19.957031-19.957032-19.957031h-6.230468c-11.003907 0-19.960938 8.953124-19.960938 19.957031v117.570312h-80.496094c0-4.898437 0-143.535156 0-148.449219zm111.644532 166.5c0 2.769531-2.382813 4.957031-4.957032 4.957031h-6.230468c-2.554688 0-4.957032-2.171875-4.957032-4.957031v-9.15625h16.144532zm-184.996094-62.121094 58.351562-70.292969v108.253907h-59.753906v-34.070313c0-1.421875.5-2.800781 1.402344-3.890625zm-1.402344 60.988281v-8.023437h59.753906v14.113281h-53.664062c-3.359375 0-6.089844-2.730468-6.089844-6.089844zm227.632812 52.546876h-98.617187v-13.078126h98.617187zm43.390626-28.082032c-4.664063 0-180.183594 0-185.394532 0-5.996094 0-10.875-4.875-10.875-10.871094v-2.207031h83.367188c3.675781 6.109375 10.261718 9.707031 17.089844 9.707031h6.230468c6.875 0 13.433594-3.632812 17.089844-9.707031h83.367188v2.207031c0 5.996094-4.878907 10.871094-10.875 10.871094zm85.628906-24.464844c0 3.359376-2.730469 6.089844-6.089844 6.089844h-53.664062c0-5.441406 0-8.847656 0-14.113281h59.753906zm0 0" fill="#FFDA44"/><path d="m192.292969 219.828125c33.992187 0 61.648437-27.652344 61.648437-61.644531 0-33.992188-27.65625-61.648438-61.648437-61.648438-33.992188 0-61.644531 27.65625-61.644531 61.648438 0 33.992187 27.65625 61.644531 61.644531 61.644531zm0-108.289063c25.722656 0 46.644531 20.921876 46.644531 46.644532 0 25.71875-20.921875 46.644531-46.644531 46.644531-25.71875 0-46.644531-20.925781-46.644531-46.644531 0-25.722656 20.925781-46.644532 46.644531-46.644532zm0 0" fill="#FFDA44"/><path d="m155.363281 504.5v-14.535156c0-4.144532-3.355469-7.5-7.5-7.5s-7.5 3.355468-7.5 7.5v14.535156c0 4.140625 3.355469 7.5 7.5 7.5s7.5-3.359375 7.5-7.5zm0 0" fill="#FFDA44"/><path d="m184.984375 504.5v-14.535156c0-4.144532-3.355469-7.5-7.5-7.5s-7.5 3.355468-7.5 7.5v14.535156c0 4.140625 3.355469 7.5 7.5 7.5s7.5-3.359375 7.5-7.5zm0 0" fill="#FFDA44"/><path d="m214.605469 504.5v-14.535156c0-4.144532-3.355469-7.5-7.5-7.5s-7.5 3.355468-7.5 7.5v14.535156c0 4.140625 3.355469 7.5 7.5 7.5s7.5-3.359375 7.5-7.5zm0 0" fill="#FFDA44"/><path d="m244.226562 504.5v-14.535156c0-4.144532-3.355468-7.5-7.5-7.5-4.144531 0-7.5 3.355468-7.5 7.5v14.535156c0 4.140625 3.355469 7.5 7.5 7.5 4.144532 0 7.5-3.359375 7.5-7.5zm0 0" fill="#FFDA44"/><path d="m192.292969 194.085938c19.800781 0 35.90625-16.105469 35.90625-35.902344 0-19.800782-16.105469-35.90625-35.90625-35.90625-19.796875 0-35.902344 16.105468-35.902344 35.90625 0 19.796875 16.105469 35.902344 35.902344 35.902344zm0-56.808594c11.527343 0 20.90625 9.378906 20.90625 20.90625 0 11.523437-9.378907 20.902344-20.90625 20.902344-11.523438 0-20.902344-9.378907-20.902344-20.902344 0-11.527344 9.378906-20.90625 20.902344-20.90625zm0 0" fill="#FFDA44"/>
          </svg>
        </div>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: space-around; " >
        <div>
          <!-- plan -->
          <svg xmlns="http://www.w3.org/2000/svg" height="64px" width="64px" viewBox="1 -33 511.999 511" >
            <path d="m235.179688 222.875c0 11.480469 9.339843 20.820312 20.820312 20.820312s20.820312-9.339843 20.820312-20.820312-9.339843-20.816406-20.820312-20.816406-20.820312 9.335937-20.820312 20.816406zm20.820312-5.816406c3.207031 0 5.816406 2.609375 5.816406 5.816406 0 3.210938-2.609375 5.820312-5.816406 5.820312s-5.820312-2.609374-5.820312-5.820312c0-3.207031 2.613281-5.816406 5.820312-5.816406zm0 0" fill="#FFDA44"/><path d="m133.46875 346.214844c-4.144531 0-7.5 3.355468-7.5 7.5v57.003906h-72.972656c-3.257813-11.265625-13.660156-19.53125-25.964844-19.53125-14.90625 0-27.03125 12.128906-27.03125 27.035156 0 14.902344 12.125 27.03125 27.03125 27.03125 12.304688 0 22.707031-8.265625 25.964844-19.53125h80.472656c4.144531 0 7.5-3.359375 7.5-7.5v-64.507812c0-4.140625-3.355469-7.5-7.5-7.5zm-106.4375 84.039062c-6.632812 0-12.03125-5.398437-12.03125-12.03125 0-6.636718 5.398438-12.03125 12.03125-12.03125 6.636719 0 12.03125 5.394532 12.03125 12.03125 0 6.632813-5.394531 12.03125-12.03125 12.03125zm0 0" fill="#FFDA44"/><path d="m484.96875.5c-12.304688 0-22.707031 8.265625-25.96875 19.53125h-80.46875c-4.144531 0-7.5 3.355469-7.5 7.5v64.503906c0 4.144532 3.355469 7.503906 7.5 7.503906s7.5-3.359374 7.5-7.503906v-57.003906h72.96875c3.261719 11.265625 13.664062 19.53125 25.96875 19.53125 14.902344 0 27.03125-12.125 27.03125-27.03125s-12.125-27.03125-27.03125-27.03125zm0 39.0625c-6.636719 0-12.03125-5.394531-12.03125-12.03125 0-6.632812 5.394531-12.03125 12.03125-12.03125 6.632812 0 12.03125 5.398438 12.03125 12.03125 0 6.636719-5.398438 12.03125-12.03125 12.03125zm0 0" fill="#FFDA44"/><path d="m484.96875 391.1875c-12.304688 0-22.707031 8.265625-25.96875 19.53125h-72.96875v-57.003906c0-4.144532-3.355469-7.5-7.5-7.5s-7.5 3.355468-7.5 7.5v64.507812c0 4.140625 3.355469 7.5 7.5 7.5h80.46875c3.261719 11.265625 13.664062 19.53125 25.96875 19.53125 14.902344 0 27.03125-12.128906 27.03125-27.03125 0-14.90625-12.125-27.035156-27.03125-27.035156zm0 39.066406c-6.636719 0-12.03125-5.398437-12.03125-12.03125 0-6.636718 5.394531-12.03125 12.03125-12.03125 6.632812 0 12.03125 5.394532 12.03125 12.03125 0 6.632813-5.398438 12.03125-12.03125 12.03125zm0 0" fill="#FFDA44"/><path d="m27.03125 54.5625c12.304688 0 22.707031-8.261719 25.964844-19.53125h72.972656v57.007812c0 4.140626 3.355469 7.5 7.5 7.5s7.5-3.359374 7.5-7.5v-64.507812c0-4.144531-3.355469-7.5-7.5-7.5h-80.472656c-3.257813-11.265625-13.660156-19.53125-25.964844-19.53125-14.90625 0-27.03125 12.125-27.03125 27.03125s12.125 27.03125 27.03125 27.03125zm0-39.0625c6.636719 0 12.03125 5.398438 12.03125 12.03125s-5.394531 12.03125-12.03125 12.03125c-6.632812 0-12.03125-5.398438-12.03125-12.03125s5.398438-12.03125 12.03125-12.03125zm0 0" fill="#FFDA44"/><path d="m484.96875 195.84375c-12.304688 0-22.707031 8.265625-25.96875 19.53125h-22.59375c-4.144531 0-7.5 3.359375-7.5 7.5 0 4.144531 3.355469 7.5 7.5 7.5h22.59375c3.261719 11.269531 13.664062 19.53125 25.96875 19.53125 14.902344 0 27.03125-12.125 27.03125-27.03125 0-14.902344-12.125-27.03125-27.03125-27.03125zm0 39.0625c-6.636719 0-12.03125-5.394531-12.03125-12.027344 0-6.636718 5.394531-12.03125 12.03125-12.03125 6.632812 0 12.03125 5.394532 12.03125 12.03125 0 6.632813-5.398438 12.027344-12.03125 12.027344zm0 0" fill="#FFDA44"/><path d="m27.03125 249.910156c12.304688 0 22.707031-8.265625 25.964844-19.53125h22.597656c4.140625 0 7.5-3.359375 7.5-7.5 0-4.144531-3.359375-7.503906-7.5-7.503906h-22.597656c-3.257813-11.265625-13.660156-19.53125-25.964844-19.53125-14.90625 0-27.03125 12.128906-27.03125 27.03125 0 14.90625 12.125 27.035156 27.03125 27.035156zm0-39.066406c6.636719 0 12.03125 5.398438 12.03125 12.03125 0 6.636719-5.394531 12.03125-12.03125 12.03125-6.632812 0-12.03125-5.394531-12.03125-12.03125 0-6.632812 5.398438-12.03125 12.03125-12.03125zm0 0" fill="#FFDA44"/><path d="m238.5 175.375h-.335938c-5.914062 0-11.421874 3.183594-14.382812 8.304688l-17.835938 30.894531c-2.957031 5.121093-2.957031 11.484375 0 16.605469l17.835938 30.894531c2.960938 5.121093 8.46875 8.300781 14.382812 8.300781h35.671876c5.914062 0 11.425781-3.179688 14.382812-8.300781l17.835938-30.898438c2.953124-5.117187 2.953124-11.480469 0-16.601562l-17.835938-30.894531c-2.957031-5.121094-8.46875-8.304688-14.382812-8.304688h-.335938c-4.144531 0-7.5 3.359375-7.5 7.5 0 4.144531 3.355469 7.503906 7.5 7.503906h.335938c.570312 0 1.105468.304688 1.390624.800782l17.835938 30.890624c.285156.496094.285156 1.113282 0 1.609376l-17.835938 30.894531c-.285156.492187-.816406.800781-1.390624.800781h-35.671876c-.574218 0-1.105468-.308594-1.390624-.800781l-17.835938-30.894531c-.289062-.496094-.289062-1.109376 0-1.605469l17.832031-30.890625c.289063-.496094.820313-.804688 1.394531-.804688h.335938c4.140625 0 7.5-3.359375 7.5-7.503906 0-4.140625-3.359375-7.5-7.5-7.5zm0 0" fill="#FFDA44"/><path d="m378 302.789062-15.1875-15.1875c6.601562-10.878906 11.46875-22.617187 14.480469-34.960937h21.480469c8.941406 0 16.214843-7.273437 16.214843-16.214844v-27.097656c0-8.9375-7.273437-16.214844-16.214843-16.214844h-21.480469c-3.015625-12.34375-7.878907-24.082031-14.480469-34.960937l15.1875-15.1875c6.324219-6.320313 6.324219-16.609375 0-22.929688l-19.160156-19.160156c-6.320313-6.320312-16.605469-6.320312-22.929688 0l-15.1875 15.191406c-10.875-6.605468-22.613281-11.46875-34.960937-14.484375v-21.480469c0-8.941406-7.273438-16.214843-16.214844-16.214843h-27.09375c-8.941406 0-16.214844 7.273437-16.214844 16.214843v21.480469c-12.34375 3.015625-24.085937 7.878907-34.960937 14.484375l-15.191406-15.191406c-6.320313-6.320312-16.605469-6.320312-22.929688 0l-19.15625 19.160156c-6.324219 6.320313-6.324219 16.605469 0 22.929688l15.1875 15.1875c-6.601562 10.878906-11.46875 22.617187-14.480469 34.960937h-21.480469c-8.941406 0-16.214843 7.273438-16.214843 16.214844v27.09375c0 8.941406 7.273437 16.214844 16.214843 16.214844h21.480469c3.015625 12.347656 7.878907 24.085937 14.480469 34.960937l-15.1875 15.191406c-6.324219 6.320313-6.324219 16.605469 0 22.929688l19.15625 19.160156c6.324219 6.320313 16.609375 6.320313 22.929688-.003906l15.191406-15.1875c10.875 6.601562 22.613281 11.464844 34.960937 14.484375v21.480469c0 8.9375 7.273438 16.210937 16.214844 16.210937h27.09375c8.941406 0 16.214844-7.273437 16.214844-16.210937v-21.480469c12.347656-3.019531 24.085937-7.882813 34.960937-14.484375l15.1875 15.191406c6.324219 6.320313 16.609375 6.320313 22.929688 0l19.160156-19.160156c6.324219-6.320312 6.324219-16.609375 0-22.929688zm-10.605469 12.320313-19.160156 19.160156c-.472656.472657-1.238281.476563-1.714844 0l-16.925781-16.925781c-3.972656-3.96875-10.066406-4.632812-14.820312-1.621094-10.683594 6.777344-22.351563 11.613282-34.679688 14.367188-5.496094 1.230468-9.335938 6.011718-9.335938 11.628906v23.933594c0 .667968-.542968 1.210937-1.210937 1.210937h-27.09375c-.667969 0-1.214844-.542969-1.214844-1.210937v-23.933594c0-5.617188-3.839843-10.398438-9.332031-11.628906-12.328125-2.753906-23.996094-7.589844-34.683594-14.367188-1.988281-1.261718-4.210937-1.878906-6.417968-1.878906-3.0625 0-6.09375 1.191406-8.402344 3.503906l-16.921875 16.921875c-.472657.472657-1.242188.476563-1.714844 0l-19.160156-19.160156c-.472657-.472656-.472657-1.238281 0-1.714844l16.925781-16.921875c3.96875-3.972656 4.636719-10.070312 1.617188-14.824218-6.773438-10.683594-11.605469-22.351563-14.367188-34.679688-1.226562-5.496094-6.007812-9.332031-11.625-9.332031h-23.929688c-.671874 0-1.214843-.542969-1.214843-1.214844v-27.09375c0-.667969.542969-1.214844 1.214843-1.214844h23.929688c5.617188 0 10.398438-3.835937 11.628906-9.332031 2.757813-12.328125 7.589844-23.996094 14.363282-34.679688 3.019531-4.753906 2.351562-10.847656-1.621094-14.824218l-16.921875-16.921875c-.472657-.472657-.472657-1.242188 0-1.714844l19.160156-19.160156c.472656-.472657 1.242187-.472657 1.714844 0l16.921875 16.925781c3.976562 3.972656 10.074218 4.640625 14.824218 1.621094 10.683594-6.777344 22.351563-11.609375 34.675782-14.367188 5.496094-1.230468 9.335937-6.011718 9.335937-11.628906v-23.929688c0-.667968.546875-1.214843 1.214844-1.214843h27.09375c.667969 0 1.210937.546875 1.210937 1.214843v23.929688c0 5.617188 3.839844 10.398438 9.335938 11.628906 12.328125 2.757813 23.996094 7.589844 34.675781 14.363282 4.753907 3.019531 10.851563 2.355468 14.828125-1.617188l16.921875-16.925781c.472657-.46875 1.242188-.472657 1.714844 0l19.160156 19.160156c.472657.472656.472657 1.242187 0 1.714844l-16.925781 16.925781c-3.972656 3.972656-4.636719 10.066406-1.621094 14.820312 6.777344 10.683594 11.609375 22.351563 14.367188 34.683594 1.230468 5.492188 6.011718 9.328125 11.628906 9.328125h23.929688c.667968 0 1.214843.546875 1.214843 1.214844v27.09375c0 .671875-.546875 1.214844-1.214843 1.214844h-23.929688c-5.617188 0-10.398438 3.835937-11.628906 9.332031-2.757813 12.328125-7.589844 23.996094-14.367188 34.679688-3.015625 4.753906-2.351562 10.851562 1.621094 14.824218l16.925781 16.921875c.472657.476563.472657 1.242188 0 1.714844zm0 0" fill="#FFDA44"/><path d="m332.039062 206.910156c.847657 4.054688 4.824219 6.652344 8.875 5.808594 4.054688-.847656 6.65625-4.820312 5.808594-8.875-8.914062-42.679688-47.066406-73.65625-90.722656-73.65625-51.109375 0-92.6875 41.582031-92.6875 92.691406s41.578125 92.6875 92.6875 92.6875c43.65625 0 81.808594-30.976562 90.722656-73.652344.847656-4.054687-1.753906-8.03125-5.808594-8.875-4.050781-.839843-8.027343 1.753907-8.875 5.808594-7.46875 35.761719-39.449218 61.71875-76.039062 61.71875-42.835938 0-77.6875-34.851562-77.6875-77.6875 0-42.835937 34.851562-77.6875 77.6875-77.6875 36.589844-.003906 68.570312 25.953125 76.039062 61.71875zm0 0" fill="#FFDA44"/>
          </svg>
        </div>
        <div>
          <!-- light bulb -->
          <svg xmlns="http://www.w3.org/2000/svg" height="64px" width="64px" viewBox="-17 0 512 512.00042" >
            <path d="m437.5625 119.476562c1.953125 0 3.90625-.761718 5.375-2.269531l24.222656-24.886719c2.890625-2.96875 2.828125-7.71875-.140625-10.605468-2.96875-2.890625-7.71875-2.824219-10.605469.140625l-24.226562 24.886719c-4.628906 4.757812-1.21875 12.734374 5.375 12.734374zm0 0" fill="#FFDA44"/><path d="m442.9375 237.101562c-2.886719-2.964843-7.636719-3.03125-10.605469-.140624-2.96875 2.886718-3.03125 7.636718-.144531 10.605468l24.226562 24.882813c2.886719 2.96875 7.636719 3.035156 10.605469.144531s3.03125-7.636719.140625-10.605469zm0 0" fill="#FFDA44"/><path d="m470.167969 169.652344h-24.222657c-4.144531 0-7.5 3.359375-7.5 7.5 0 4.144531 3.355469 7.5 7.5 7.5h24.222657c4.144531 0 7.5-3.355469 7.5-7.5 0-4.140625-3.355469-7.5-7.5-7.5zm0 0" fill="#FFDA44"/><path d="m10.65625 81.714844c-2.96875 2.890625-3.03125 7.640625-.140625 10.605468l24.230469 24.886719c2.890625 2.96875 7.636718 3.03125 10.605468.140625s3.03125-7.636718.140626-10.605468l-24.230469-24.886719c-2.890625-2.964844-7.640625-3.03125-10.605469-.140625zm0 0" fill="#FFDA44"/><path d="m45.355469 236.960938c-2.96875-2.890626-7.71875-2.828126-10.605469.140624l-24.234375 24.886719c-2.890625 2.96875-2.828125 7.714844.140625 10.605469s7.71875 2.828125 10.605469-.140625l24.234375-24.886719c2.886718-2.964844 2.824218-7.714844-.140625-10.605468zm0 0" fill="#FFDA44"/><path d="m39.234375 177.15625c0-4.144531-3.355469-7.503906-7.5-7.503906h-24.234375c-4.144531 0-7.5 3.359375-7.5 7.503906 0 4.140625 3.355469 7.5 7.5 7.5h24.234375c4.144531 0 7.5-3.359375 7.5-7.5zm0 0" fill="#FFDA44"/><path d="m241.066406 15.015625c82.207032 1.117187 150.128906 63.605469 157.988282 145.355469.394531 4.125 4.050781 7.148437 8.183593 6.75 4.125-.398438 7.144531-4.0625 6.75-8.1875-8.527343-88.652344-82.640625-157.691406-172.71875-158.9140628-96.875-1.3867192-177.457031 75.3906248-178.402343 174.2421878-.457032 47.902343 18.011718 92.867187 52.003906 126.605469 28.148437 27.9375 34.867187 55.632812 47.222656 92.003906-6.203125 3.914062-10.335938 10.824218-10.335938 18.6875v6.679687c0 5.585938 2.085938 10.6875 5.515626 14.582031-3.429688 3.890626-5.515626 8.992188-5.515626 14.578126v6.683593c0 12.171875 9.902344 22.078125 22.078126 22.078125h13.617187v13.761719c0 12.175781 9.902344 22.078125 22.078125 22.078125h58.605469c12.175781 0 22.082031-9.902344 22.082031-22.078125v-13.761719h13.613281c12.175781 0 22.082031-9.90625 22.082031-22.078125v-6.683593c0-5.585938-2.089843-10.6875-5.519531-14.578126 3.429688-3.894531 5.519531-8.996093 5.519531-14.582031v-6.679687c0-7.863282-4.132812-14.773438-10.339843-18.6875 12.496093-36.789063 19.09375-63.984375 47.449219-92.234375 28.328124-28.214844 46.332031-65.5625 50.703124-105.160157.457032-4.117187-2.515624-7.820312-6.632812-8.277343-4.113281-.4375-7.820312 2.519531-8.277344 6.636719-3.996094 36.207031-20.464844 70.363281-46.378906 96.175781-30.972656 30.851562-38.328125 60.535156-51.550781 99.464843h-10.671875v-5.398437c0-11.09375-8.769532-20.152344-19.738282-20.667969.792969-41.574218 8.007813-71.761718 11.210938-83.210937h7.277344c12.175781 0 22.082031-9.90625 22.082031-22.078125v-6.683594c0-12.175781-9.90625-22.078125-22.082031-22.078125h-32.625c-4.140625 0-7.5 3.355469-7.5 7.5s3.359375 7.5 7.5 7.5h32.625c3.90625 0 7.082031 3.175781 7.082031 7.078125v6.683594c0 3.902344-3.175781 7.078125-7.082031 7.078125h-100.265625c-3.902344 0-7.078125-3.175781-7.078125-7.078125v-6.683594c0-3.902344 3.175781-7.078125 7.078125-7.078125h32.640625c4.144531 0 7.5-3.355469 7.5-7.5s-3.355469-7.5-7.5-7.5h-32.640625c-12.171875 0-22.078125 9.902344-22.078125 22.078125v6.683594c0 12.171875 9.90625 22.078125 22.078125 22.078125h7.28125c3.199219 11.453125 10.414062 41.640625 11.210937 83.210937-10.96875.515625-19.738281 9.574219-19.738281 20.667969v5.398437h-10.671875c-13.148438-38.714843-20.546875-68.691406-51.34375-99.257812-31.09375-30.859375-47.988281-71.992188-47.570312-115.8125.855468-89.367188 73.289062-160.566406 163.199218-159.390625zm34.152344 474.90625c0 3.902344-3.175781 7.078125-7.078125 7.078125h-58.609375c-3.902344 0-7.078125-3.175781-7.078125-7.078125v-13.761719h72.765625zm35.695312-35.839844c0 3.902344-3.175781 7.078125-7.082031 7.078125-4.414062 0-125.578125 0-129.996093 0-3.902344 0-7.078126-3.175781-7.078126-7.078125v-6.683593c0-3.902344 3.175782-7.078126 7.078126-7.078126h129.996093c3.90625 0 7.082031 3.175782 7.082031 7.078126zm-44.789062-173.882812c-3.773438 14.425781-9.9375 43.761719-10.652344 83.164062h-33.277344c-.714843-39.402343-6.878906-68.738281-10.648437-83.164062zm-63.671875 103.878906c0-3.152344 2.5625-5.714844 5.710937-5.714844h61.339844c3.152344 0 5.714844 2.5625 5.714844 5.714844v5.398437h-72.765625zm101.40625 20.402344c3.859375.023437 7.054687 3.152343 7.054687 7.078125v6.679687c0 3.902344-3.175781 7.082031-7.082031 7.082031h-129.996093c-3.902344 0-7.078126-3.179687-7.078126-7.082031v-6.679687c0-3.953125 3.226563-7.082032 7.078126-7.082032 1.890624 0 130.023437.003907 130.023437.003907zm0 0" fill="#FFDA44"/>
          </svg>
        </div>
      </div>
    </div>

<!-- animation -->
  <div style="display: flex; flex-direction: row; justify-content: space-around; " >
    <svg version="1.1" width="320" height="320" viewBox="0 0 320 320" fill="none" 
                       stroke="#ffff00" stroke-linecap="round"
                       xmlns="http://www.w3.org/2000/svg" 
                       xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <path id="r1">
          <animate id="p1" attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin"/>
        </path>
        <path id="r2">
          <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+1s"/>
          <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+1s"/>
        </path>
        <path id="r3">
          <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+2s"/>
          <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+2s"/>
        </path>
        <path id="r4">
          <animate id="p1" attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+3s"/>
          <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+3s"/>
        </path>
        <path id="r5">
          <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+4s"/>
          <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+4s"/>
        </path>
        <path id="r6">
          <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+5s"/>
          <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+5s"/>
        </path>
      </defs>
      <use xlink:href="#r1"/>
      <use xlink:href="#r1" transform="rotate(60 160 160)"/>
      <use xlink:href="#r1" transform="rotate(120 160 160)"/>
      <use xlink:href="#r1" transform="rotate(180 160 160)"/>
      <use xlink:href="#r1" transform="rotate(240 160 160)"/>
      <use xlink:href="#r1" transform="rotate(300 160 160)"/>
      <use xlink:href="#r2" transform="rotate(30 160 160)"/>
      <use xlink:href="#r2" transform="rotate(90 160 160)"/>
      <use xlink:href="#r2" transform="rotate(150 160 160)"/>
      <use xlink:href="#r2" transform="rotate(210 160 160)"/>
      <use xlink:href="#r2" transform="rotate(270 160 160)"/>
      <use xlink:href="#r2" transform="rotate(330 160 160)"/>
      <use xlink:href="#r3"/>
      <use xlink:href="#r3" transform="rotate(60 160 160)"/>
      <use xlink:href="#r3" transform="rotate(120 160 160)"/>
      <use xlink:href="#r3" transform="rotate(180 160 160)"/>
      <use xlink:href="#r3" transform="rotate(240 160 160)"/>
      <use xlink:href="#r3" transform="rotate(300 160 160)"/>
      <use xlink:href="#r4" transform="rotate(30 160 160)"/>
      <use xlink:href="#r4" transform="rotate(90 160 160)"/>
      <use xlink:href="#r4" transform="rotate(150 160 160)"/>
      <use xlink:href="#r4" transform="rotate(210 160 160)"/>
      <use xlink:href="#r4" transform="rotate(270 160 160)"/>
      <use xlink:href="#r4" transform="rotate(330 160 160)"/>
      <use xlink:href="#r5"/>
      <use xlink:href="#r5" transform="rotate(60 160 160)"/>
      <use xlink:href="#r5" transform="rotate(120 160 160)"/>
      <use xlink:href="#r5" transform="rotate(180 160 160)"/>
      <use xlink:href="#r5" transform="rotate(240 160 160)"/>
      <use xlink:href="#r5" transform="rotate(300 160 160)"/>
      <use xlink:href="#r6" transform="rotate(30 160 160)"/>
      <use xlink:href="#r6" transform="rotate(90 160 160)"/>
      <use xlink:href="#r6" transform="rotate(150 160 160)"/>
      <use xlink:href="#r6" transform="rotate(210 160 160)"/>
      <use xlink:href="#r6" transform="rotate(270 160 160)"/>
      <use xlink:href="#r6" transform="rotate(330 160 160)"/>
    </svg>
  </div>

  </div>
  `,
})
export class StylingComponent {

}
