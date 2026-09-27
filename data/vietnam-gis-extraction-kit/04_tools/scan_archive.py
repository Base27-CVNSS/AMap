#!/usr/bin/env python3
"""Scan XAPK/APK/ZIP for embedded GIS-like resources without calling network endpoints."""
from pathlib import Path
import argparse, zipfile, csv

GIS_EXTS={'.geojson','.kml','.kmz','.gpx','.pbf','.mvt','.gpkg','.shp','.shx','.dbf','.prj','.sqlite','.db','.json','.bin','.dat','.zip'}
KEYWORDS=('road','lane','traffic','signal','map','route','offline','city','poi','geo','boundary','border')

p=argparse.ArgumentParser()
p.add_argument('archive')
p.add_argument('-o','--output',default='scan.csv')
a=p.parse_args()

rows=[]
with zipfile.ZipFile(a.archive) as z:
  for info in z.infolist():
    q=Path(info.filename)
    low=info.filename.lower()
    if q.suffix.lower() in GIS_EXTS or any(k in low for k in KEYWORDS):
      rows.append([info.filename,info.file_size,q.suffix.lower()])

with open(a.output,'w',newline='',encoding='utf-8-sig') as f:
  w=csv.writer(f)
  w.writerow(['path','size_bytes','extension'])
  w.writerows(rows)

print(f'wrote {len(rows)} rows -> {a.output}')
