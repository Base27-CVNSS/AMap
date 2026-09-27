#!/usr/bin/env python3
"""Normalize a vector dataset into separate Point/Line/Polygon GeoPackage layers."""
import argparse, json
import geopandas as gpd
import pandas as pd
from shapely.geometry import MultiPolygon

COMMON=['id','source','source_id','class','subclass','name','name_en','admin_level','road_class','oneway','speed_kph','valid_from','valid_to','confidence','license','source_version','updated_at','props_json']

def normalize(gdf,source):
  if gdf.crs is None:
    raise SystemExit('Input CRS missing; define it before normalization')
  gdf=gdf.to_crs(4326).copy()
  for c in COMMON:
    if c not in gdf.columns:
      gdf[c]=None
  gdf['source']=gdf['source'].fillna(source)
  if gdf['id'].isna().all():
    gdf['id']=[f'{source}:{i}' for i in range(len(gdf))]
  known=set(COMMON+['geometry'])
  extra=[c for c in gdf.columns if c not in known]
  if extra:
    gdf['props_json']=gdf.apply(
      lambda r: json.dumps({c:r[c] for c in extra if pd.notna(r[c])},ensure_ascii=False,default=str),
      axis=1
    )
  return gdf[COMMON+['geometry']]

p=argparse.ArgumentParser()
p.add_argument('input')
p.add_argument('output')
p.add_argument('--source',default='imported')
a=p.parse_args()

gdf=normalize(gpd.read_file(a.input),a.source)
pts=gdf[gdf.geometry.geom_type.isin(['Point','MultiPoint'])].copy()
lines=gdf[gdf.geometry.geom_type.isin(['LineString','MultiLineString'])].copy()
polys=gdf[gdf.geometry.geom_type.isin(['Polygon','MultiPolygon'])].copy()

if len(polys):
  polys['geometry']=polys.geometry.apply(lambda g:g if g.geom_type=='MultiPolygon' else MultiPolygon([g]))
if len(pts):
  pts.to_file(a.output,layer='vn_points',driver='GPKG')
if len(lines):
  lines.to_file(a.output,layer='vn_lines',driver='GPKG',mode='a')
if len(polys):
  polys.to_file(a.output,layer='vn_polygons',driver='GPKG',mode='a')

print({'points':len(pts),'lines':len(lines),'polygons':len(polys)})
