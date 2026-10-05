"""Create an editable Celar Air model in a new Blender scene."""
import bpy
import math
import json
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / '3d'
WEB = ROOT / 'dist' / 'assets'
OUT.mkdir(parents=True, exist_ok=True)
WEB.mkdir(parents=True, exist_ok=True)

scene = bpy.data.scenes.new('Celar Air | Product Studio')
bpy.context.window.scene = scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'CENTIMETERS'
product = bpy.data.collections.new('CELAR AIR | Wall Mounted AC')
studio = bpy.data.collections.new('STUDIO | Camera and Lighting')
helpers = bpy.data.collections.new('CONSTRUCTION | Editable Outlet Cutter')
for col in (product, studio, helpers):
    scene.collection.children.link(col)

def move_to(obj, col):
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    col.objects.link(obj)

def material(name, color, rough=.35, metallic=0, emission=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bs = mat.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*color, 1)
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['Metallic'].default_value = metallic
    if emission:
        bs.inputs['Emission Color'].default_value = (*color, 1)
        bs.inputs['Emission Strength'].default_value = emission
    return mat

white = material('Satin porcelain | Front cover', (.89, .915, .93), .26)
shell = material('Warm white ABS | Housing', (.77, .82, .85), .33)
rear = material('Rear chassis | Soft grey', (.35, .42, .47), .5)
dark = material('Outlet interior | Graphite navy', (.013, .024, .033), .42)
vane = material('Guide vanes | Deep slate', (.035, .06, .074), .34)
blue = material('Celar blue | Brand', (.017, .17, .32), .32)
silver = material('Fine trim | Brushed silver', (.42, .53, .60), .3, .65)
led = material('Ice blue | LED display', (.20, .67, .87), .22, 0, 1.5)
sky = material('Studio | Pale blue', (.69, .82, .9), .7)

def activate(obj):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

def bevel(obj, amount, segments=4, apply=True):
    mod = obj.modifiers.new('Soft manufactured edges', 'BEVEL')
    mod.width = amount
    mod.segments = segments
    if apply:
        activate(obj)
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return mod

def smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True
    mod = obj.modifiers.new('Weighted surface normals', 'WEIGHTED_NORMAL')
    mod.keep_sharp = True
    mod.weight = 50

def box(name, location, dimensions, mat, radius=.002, col=product, segments=4):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    move_to(obj, col)
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if radius:
        bevel(obj, radius, segments)
    if mat:
        obj.data.materials.append(mat)
    smooth(obj)
    return obj

body = box('AC_Body | Rounded ABS shell', (0, 0, 0), (.92, .225, .30), shell, .025, segments=8)
body['description'] = 'Generic Celar Air concept, 920 x 300 x 225 mm. Front points -Y, up +Z.'
body['website_hotspot'] = 'installation'
chassis = box('Rear_Chassis | Wall mount back', (0, .107, 0), (.855, .032, .251), rear, .013)

cutter = box('Outlet_Cutter | Non-rendering construction', (0, -.126, -.095), (.803, .112, .072), None, .019, helpers, 6)
activate(body)
cut = body.modifiers.new('Recessed air outlet', 'BOOLEAN')
cut.operation = 'DIFFERENCE'
cut.solver = 'EXACT'
cut.object = cutter
bpy.ops.object.modifier_apply(modifier=cut.name)
cutter.hide_render = True
cutter.hide_set(True)
bevel(body, .0015, 2)

cover = box('Front_Cover | Service panel', (0, -.110, .044), (.884, .069, .195), white, .022, segments=8)
cover['website_hotspot'] = 'cleaning'
cover['description'] = 'Separate service cover, ready for a future opening animation.'

box('Outlet_Recess | Shadow cavity', (0, -.074, -.095), (.78, .014, .062), dark, .014, segments=5)
box('Outlet_Upper_Lip | Fine highlight', (0, -.13, -.0605), (.755, .020, .006), white, .002)

# Thin louvers remain independently editable; common material keeps the web asset small.
for i in range(11):
    x = -.346 + i * .0692
    obj = box('Guide_Vane_%02d' % (i+1), (x, -.101, -.094), (.0023, .048, .042), vane, .001, segments=2)
    obj.rotation_euler.z = math.radians(-10)

flap = box('Swing_Flap | Adjustable horizontal blade', (0, -.133, -.119), (.756, .065, .009), white, .004, segments=4)
# Put the blade origin on its rear hinge, preserving the mesh's world placement.
hinge = Vector((0, -.102, -.115))
offset = flap.location - hinge
for vertex in flap.data.vertices:
    vertex.co += offset
flap.location = hinge
flap.rotation_euler.x = math.radians(18)
flap['description'] = 'Rotate local X to adjust airflow direction. Rest angle 18 degrees.'
flap['website_hotspot'] = 'airflow'
box('Lower_Edge | Soft silver detail', (0, -.102, -.145), (.779, .014, .0022), silver, .001, segments=2)

# Top air intake, recessed dark strips with a white centre rib.
for i in range(27):
    x = -.351 + i * .027
    box('Intake_Slot_%02d' % (i+1), (x, .019, .1498), (.014, .077, .0017), dark, .0008, segments=2)
box('Intake_Centre_Rib', (0, .019, .151), (.751, .003, .002), shell, .001, segments=2)

def text_object(name, text, location, size, mat, align='LEFT'):
    curve = bpy.data.curves.new(name, 'FONT')
    curve.body = text
    curve.align_x = align
    curve.size = size
    curve.extrude = .00008
    curve.resolution_u = 5
    obj = bpy.data.objects.new(name, curve)
    product.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (math.pi/2, 0, 0)
    obj.data.materials.append(mat)
    activate(obj)
    bpy.ops.object.convert(target='MESH')
    return bpy.context.object

text_object('Brand | CELAR AIR', 'CELAR AIR', (-.335, -.1451, .015), .016, blue)
text_object('Brand | INVERTER', 'INVERTER', (-.334, -.1451, -.001), .006, rear)
text_object('Display | 24 degrees', '24', (.294, -.1454, .020), .027, led)
text_object('Display | Degree mark', 'o', (.329, -.1454, .037), .009, led)
box('Indicator | Power light', (.340, -.1458, .020), (.008, .0013, .002), led, .00065, segments=3)

# A root transform and useful metadata for browser interaction.
root = bpy.data.objects.new('Celar_AC_Root', None)
product.objects.link(root)
root['units'] = 'meters'
root['dimensions_mm'] = '920 x 300 x 225'
root['license'] = 'Original procedural concept created for this project'
for obj in list(product.objects):
    if obj != root:
        obj.parent = root

wall = box('Studio_Wall | Pale blue shadow backdrop', (0, .176, 0), (200, .02, 200), sky, 0, studio)

def point_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()

camera_data = bpy.data.cameras.new('Product lens')
camera = bpy.data.objects.new('Camera | Three quarter hero', camera_data)
studio.objects.link(camera)
camera.location = (1.0, -2.3, .74)
point_at(camera, (0, -.03, -.012))
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 1.18
scene.camera = camera

def area(name, location, power, size, color, target=(0,0,0)):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = power
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    studio.objects.link(obj)
    obj.location = location
    point_at(obj, target)

area('Key | Broad softbox', (-.7, -1.2, 1.3), 60, 1.1, (1, .94, .86))
area('Fill | Cool front', (1.0, -.7, .35), 22, .9, (.73, .87, 1))
area('Top | White edge', (.1, -.15, 1.0), 18, .65, (1, 1, 1))

world = bpy.data.worlds.new('Studio ambient')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (.55, .68, .8, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = .25
scene.world = world
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x = 1600
scene.render.resolution_y = 1050
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = str(OUT / 'celar-air-preview.png')
scene.view_settings.view_transform = 'AgX'

# Export only the product. Camera, wall, lights and construction stay in the .blend.
bpy.ops.object.select_all(action='DESELECT')
for obj in product.objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.ops.export_scene.gltf(filepath=str(WEB / 'celar-air.glb'), export_format='GLB', use_selection=True, export_apply=True, export_extras=True, export_cameras=False, export_lights=False, export_animations=False)

triangles = 0
depsgraph = bpy.context.evaluated_depsgraph_get()
for obj in product.objects:
    if obj.type == 'MESH':
        mesh = obj.evaluated_get(depsgraph).to_mesh()
        mesh.calc_loop_triangles()
        triangles += len(mesh.loop_triangles)
        obj.evaluated_get(depsgraph).to_mesh_clear()

bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
bpy.context.view_layer.objects.active = body
for screen in bpy.data.screens:
    for a in screen.areas:
        if a.type == 'VIEW_3D':
            a.spaces.active.region_3d.view_perspective = 'CAMERA'
            a.spaces.active.overlay.show_overlays = False
            a.spaces.active.shading.type = 'MATERIAL'
            a.spaces.active.shading.use_scene_world = False
            a.spaces.active.shading.studiolight_rotate_z = .5

notes = bpy.data.texts.new('START HERE | Celar Air')
notes.write('CELAR AIR - WALL MOUNTED AC\n\nOriginal editable concept model.\nReal-world approximate dimensions: 920 x 300 x 225 mm.\nFront points -Y. Up is +Z.\nSwing_Flap has a hinge origin: rotate X to change direction.\nFront_Cover remains a separate mesh.\nThe studio collection contains only presentation objects.\nGLB contains the product only, PBR materials, no external textures.\nOriginal startup scene is preserved as Scene.\n\nWeb asset: dist/assets/celar-air.glb\n')
report = {'blend': str(OUT / 'celar-air.blend'), 'glb': str(WEB / 'celar-air.glb'), 'triangles': triangles, 'glb_bytes': (WEB / 'celar-air.glb').stat().st_size, 'product_objects': len(product.objects)}
(OUT / 'model-info.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'celar-air.blend'))
print('CELAR_MODEL_COMPLETE', json.dumps(report))
