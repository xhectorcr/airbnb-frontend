import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Propiedad {
    id: number;
    usuarioId?: number;
    titulo: string;
    descripcion: string;
    tipo?: string;
    precioMensual: number;
    distrito: string;
    direccion?: string; // Add this
    departamento: string;
    habitaciones: number;
    banos: number;
    amoblado: boolean;
    aceptaMascotas: boolean;
    aprobada: boolean;
    fechaPublicacion: string;
    fotos: { id: number; url: string }[];
    serviciosIncluidos?: boolean;
    internetIncluido?: boolean;
    aguaIncluida?: boolean;
    luzIncluida?: boolean;
    alquilado?: boolean; // New field
}

export interface PropiedadCreateDto {
    titulo: string;
    descripcion: string;
    tipo?: string; // Nuevo campo
    departamento: string;
    // distrito: string; // Removed as per request
    direccion: string;
    referencia?: string;
    precioMensual: number;
    habitaciones: number;
    banos: number;
    amoblado: boolean;
    aceptaMascotas: boolean;
    latitud?: number;
    longitud?: number;
    serviciosIncluidos?: boolean;
    internetIncluido?: boolean;
    aguaIncluida?: boolean;
    luzIncluida?: boolean;
    soloEstudiantes?: boolean;
    fotos?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class PropiedadesService {
    private apiUrl = 'http://localhost:5105/api/Propiedades'; // Same URL logic as auth

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        // Assuming token is stored in localStorage as 'authToken'
        const token = localStorage.getItem('authToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getMyProperties(): Observable<Propiedad[]> {
        return this.http.get<Propiedad[]>(`${this.apiUrl}/my-properties`, { headers: this.getHeaders() });
    }

    getAdminAllProperties(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/admin/all`, { headers: this.getHeaders() });
    }

    getAllProperties(): Observable<{ propiedades: Propiedad[], pagination: any }> {
        return this.http.get<{ propiedades: Propiedad[], pagination: any }>(this.apiUrl);
    }

    createProperty(propiedad: PropiedadCreateDto): Observable<Propiedad> {
        return this.http.post<Propiedad>(this.apiUrl, propiedad, { headers: this.getHeaders() });
    }

    updateProperty(id: number, propiedad: PropiedadCreateDto): Observable<Propiedad> {
        return this.http.put<Propiedad>(`${this.apiUrl}/${id}`, propiedad, { headers: this.getHeaders() });
    }

    deleteProperty(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    approveProperty(id: number, approved: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/approve`, approved, { headers: this.getHeaders() });
    }

    // Add more methods as needed (update, etc.)
    uploadPhotos(id: number, files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file, file.name);
        });
        return this.http.post(`${this.apiUrl}/${id}/upload-photos`, formData, { headers: this.getHeaders() });
    }

    toggleRentStatus(id: number, alquilado: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/toggle-rent`, alquilado, { headers: this.getHeaders() });
    }
}
