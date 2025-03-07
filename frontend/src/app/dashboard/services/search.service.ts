import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environments";

@Injectable({providedIn: "root"})
  export class SearchService {

    constructor(private http: HttpClient) {}


  }