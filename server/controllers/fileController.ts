import fs from 'fs/promises';
import path from 'path';
import { Request, Response, NextFunction } from "express";

interface ErrorInfo {
    method: string; 
}
